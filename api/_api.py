#!/usr/bin/env python3

import os
import glob
import sys
import datetime
import time
import requests
import rich
import environ
import math
import threading

env = environ.Env()
environ.Env.read_env()

from _utils_timeout import *
from _utils_logstash import *


token = ""
fast_token = ""
tokencachefile = "/tmp/.token"

if __name__ == "__main__":
    print("raw(req)")
    print("callapi(req, multiple = False)")
    print("userify(user)")


def test_token(mode="slow"):
    try:
        check = raw("/v2/users/jjaqueme", for_test = True, mode=mode)
    except:
        return False
    return check.status_code == 200

def get_headers(force_refresh = False, mode="slow"):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    global token
    global fast_token
    global tokencachefile

    if (((len(token) == 0 and mode == "slow") or (len(fast_token) == 0 and mode != "slow")) and force_refresh == False):
        if (os.path.isfile(f'{tokencachefile}_{mode}')):
            with open(f'{tokencachefile}_{mode}', "r") as f:
                if (mode == "slow"):
                    token = f.read()
                else:
                    fast_token = f.read()

        if (len(token) != 0 and mode == "slow"):
            mylogger("token from file", LOGGER_INFO)
            if (not test_token(mode)):
                mylogger("token from file invalid", LOGGER_INFO)
                token = ""

        elif (len(fast_token) != 0 and mode != "slow"):
            mylogger("fast_token from file", LOGGER_INFO)
            if (not test_token(mode)):
                mylogger("fast_token from file invalid", LOGGER_INFO)
                fast_token = ""

    if (((len(token) == 0 and mode == "slow") or (len(fast_token) == 0 and mode != "slow")) or force_refresh == True):

        if (mode == "slow"):
            API_UID = env("API_UID")
            API_SECRET = env("API_SECRET")
        
        else:
            API_UID = env("FASTAPI_UID")
            API_SECRET = env("FASTAPI_SECRET")

        request_token_payload = {
            "client_id": API_UID,
            "client_secret": API_SECRET,
            "grant_type": "client_credentials",
            "scope": "public",
        }

        mylogger("ask new token", LOGGER_INFO)
        token_url = "https://api.intra.42.fr/v2/oauth/token"
        response = requests.post(token_url, data=request_token_payload)

        if(response.ok == True or response.status_code == 200):
            jsonres = response.json()

            mylogger("got new token", LOGGER_INFO)
            if (mode == "slow"):
                token = jsonres["access_token"]
            else:
                fast_token = jsonres["access_token"]
            with open(f'{tokencachefile}_{mode}', "w") as f:
                f.write(jsonres["access_token"])
        
        else:
            mylogger(f"token get failed, status {response.status_code}, {response.reason}", LOGGER_ERROR)

    if (mode == "slow"):
        return {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json"
        }
    else:
        return {
            "Authorization": f"Bearer {fast_token}",
            "Accept": "application/json"
        }
    

def mocked_requests_get(data, status, headers = {}):
    class MockResponse:
        def __init__(self, json_data, status_code, headers):
            self.json_data = json_data
            self.status_code = status_code
            self.headers = headers

        def json(self):
            return self.json_data

    return MockResponse(data, status, headers)

def raw(req, for_test = False, mode="slow"):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    
    auth = get_headers(mode=mode)

    url = f"https://api.intra.42.fr{req}"

    if ("?" in url and "page[size]" not in url):
        url = f"{url}&page[size]=100"
    elif ("page[size]" not in url):
        url = f"{url}?page[size]=100"

    mylogger(f"request to {req}", LOGGER_INFO)

    fails = 0
    maxfails = 10 if not for_test else 2

    while (fails < maxfails):
        res = []
        if (threading.current_thread() is threading.main_thread()):
            try:
                with timeout(30):
                    res = requests.get(url, headers=auth)
            except TimeoutError:
                mylogger(f"Timeout of 30 seconds on {url}", LOGGER_WARNING)
                fails += 1
                time.sleep(5)
                continue

            except IndexError as e:
                mylogger(f"Unexpected index error {type(e)} {e} on {url}, fail {fails}", LOGGER_ERROR)
                fails += 1
                time.sleep(5)
                continue
        else:
            res = requests.get(url, headers=auth)


        x = threading.Thread(target=logtologstash, args=({
            "endpoint": url.replace("https://api.intra.42.fr", ""),
            "attempts": maxfails,
            "status": res.status_code,
            "method": res.request.method,
            "date": datetime.datetime.now().isoformat(),
            "applicationName": res.headers.get('X-Application-Name') if res.headers.get('X-Application-Name') != None else '-',
            "hourlyLimit": res.headers.get('X-Hourly-RateLimit-Remaining') if res.headers.get('X-Hourly-RateLimit-Remaining') != None else -1,
            "elapsed": res.elapsed.total_seconds(),
            "runtime": res.headers.get('X-Runtime') if res.headers.get('X-Runtime') != None else -1
        },))
        x.start()

        if (res.status_code == 200):
            return res

        elif (res.status_code == 401 and for_test == False):

            mylogger(f"Token expired / Unauthorized", LOGGER_INFO)
            auth = get_headers(force_refresh = True)

        # elif (res.status_code == 401):

        #     rich.print(res)
        #     return res

        elif (res.status_code == 429):
            ttl = res.headers.get('Retry-After')

            mylogger(f"Timeout api 429, retry: {ttl}", LOGGER_WARNING)
            if ttl != None and int(ttl) < 300:
                time.sleep(int(ttl))
            else:
                time.sleep(300)

        elif (res.status_code == 404):
            mylogger(f"API NOT FOUND {url}", LOGGER_ERROR)
            return mocked_requests_get([], 200)

        else:
            mylogger(f"Api http error: {res.status_code} {res.reason} {url}", LOGGER_WARNING)

        fails += 1
        time.sleep(1)

    mylogger(f"Raw api failed {maxfails} times", LOGGER_ERROR)
    raise Exception(f"Raw api failed {maxfails} times") 


def callapi(req, multiple = False, callback = None, callback_limit = True, nultiple=0, mode="slow"):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR


    if (multiple == True):
        nultiple = 1

    start_time = time.time()

    page = req
    rawres = raw(page, mode=mode)
    res = rawres.json()

    if (type(res) == type([]) and callback != None and nultiple <= 1):
        for i in res:
            cb_res = callback(i)
            if (callback_limit == True and cb_res == False):
                return False
        res = []

    if (nultiple >= 2):
        res = []

    perpage = rawres.headers.get("X-Per-Page")
    tot = rawres.headers.get("X-Total")
    if (rawres.headers.get("X-Runtime") and float(rawres.headers.get("X-Runtime")) <= 0.5):
        mylogger(f"So fast", LOGGER_DEBUG)
        time.sleep(0.5)

    if (type(res) == type([]) and (multiple == True or nultiple >= 1) and perpage != None and tot != None):

        for i in range(max(nultiple, 2), math.ceil(int(tot)/int(perpage)) + 1):

            if ("?" in req):
                page = f"{req}&page[number]={i}"
            else:
                page = f"{req}?page[number]={i}"

            rawres = raw(page, mode=mode)
            res.extend(rawres.json())

            if (type(res) == type([]) and callback != None):
                for i in res:
                    cb_res = callback(i)
                    if (callback_limit == True and cb_res == False):
                        return False
                res = []

            if (rawres.headers.get("X-Runtime") and float(rawres.headers.get("X-Runtime")) <= 0.5):
                mylogger(f"So fast", LOGGER_DEBUG)
                time.sleep(0.5)

    end_time = time.time()
    mylogger(f"""Request {req} {'mult' if multiple else 'direct'} {'with' if callback != None else 'without'} callback, 
    start:\t{datetime.datetime.fromtimestamp(start_time).strftime('%Y-%m-%d %H:%M:%S')}, 
    end:\t{datetime.datetime.fromtimestamp(end_time).strftime('%Y-%m-%d %H:%M:%S')}, 
    elapsed:\t{end_time - start_time}""", LOGGER_DEBUG)

    return res




    
def userify(user):
    try:
        user.pop('campus_users')
    except:
        pass
    try:
        user.pop('expertises_users')
    except:
        pass
    try:
        user.pop('patroning')
    except:
        pass
    try:
        user.pop('patroned')
    except:
        pass
    try:
        user.pop('partnerships')
    except:
        pass
    try:
        user.pop('achievements')
    except:
        pass
    try:    
        user.pop('languages_users')
    except:
        pass
    try:    
        user.pop('projects_users')
    except:
        pass

    return (user)




def raw_change(req, method, data = {}):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    
    auth = get_headers()

    url = f"https://api.intra.42.fr{req}"


    if (method.lower() == "post"):
        return requests.post(url, headers=auth)
    
    if (method.lower() == "patch"):
        return requests.patch(url, headers=auth)

    if (method.lower() == "get"):
        return requests.get(url, headers=auth)

