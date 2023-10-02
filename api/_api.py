#!/usr/bin/env python3

import os
import glob
import sys
import time
import requests
import rich
import environ
import math

env = environ.Env()
environ.Env.read_env()

from _utils import *


token = ""
tokencachefile = "/tmp/.token"

if __name__ == "__main__":
    print("raw(req)")
    print("callapi(req, multiple = False)")
    print("userify(user)")


def test_token(token):
    check = raw("/v2/users/jjaqueme", for_test = True)
    return check.status_code == 200

def get_headers(force_refresh = False):
    global token
    global tokencachefile

    if (len(token) == 0 and force_refresh == False):
        if (os.path.isfile(tokencachefile)):
            with open(f"{tokencachefile}", "r") as f:
                token = f.read()

        if (len(token) != 0):
            mylogger("token from file", LOGGER_INFO)
            if (not test_token(token)):
                mylogger("token from file invalid", LOGGER_INFO)
                token = ""

    if (len(token) == 0 or force_refresh == True):

        API_UID = env("API_UID")
        API_SECRET = env("API_SECRET")

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
            token = jsonres["access_token"]
            with open(f"{tokencachefile}", "w") as f:
                f.write(jsonres["access_token"])
        
        else:
            mylogger(f"token get failed, status {response.status_code}, {response.reason}", LOGGER_ERROR)


    return {
        "Authorization": f"Bearer {token}"
    }
    

def raw(req, for_test = False):
    auth = get_headers()

    url = f"https://api.intra.42.fr{req}"

    if ("?" in url and "page[size]" not in url):
        url = f"{url}&page[size]=100"
    elif ("page[size]" not in url):
        url = f"{url}?page[size]=100"

    mylogger(f"request to {req}", LOGGER_INFO)

    fails = 0
    maxfails = 10

    while (fails < maxfails):
        res = requests.get(url, headers=auth)

        if (res.status_code == 200):
            return res

        elif (res.status_code == 401 and for_test == False):
            mylogger(f"Token expired / Unauthorized", LOGGER_INFO)
            auth = get_headers(force_refresh = True)

        elif (res.status_code == 429):
            mylogger(f"Timeout api", LOGGER_INFO)

        else:
            mylogger(f"Api http error: {res.status_code} {res.reason}", LOGGER_WARNING)

        fails += 1
        time.sleep(1)

    mylogger(f"Raw api failed {maxfails} times", LOGGER_ERROR)
    raise Exception(f"Raw api failed {maxfails} times") 


def callapi(req, multiple = False):

    page = req
    rawres = raw(page)
    res = rawres.json()

    perpage = rawres.headers.get("X-Per-Page")
    tot = rawres.headers.get("X-Total")
    if (rawres.headers.get("X-Runtime") and float(rawres.headers.get("X-Runtime")) <= 0.5):
        mylogger(f"So fast", LOGGER_DEBUG)
        time.sleep(0.5)

    if (type(res) == type([]) and multiple == True and perpage != None and tot != None):

        for i in range(2, math.ceil(int(tot)/int(perpage)) + 1):

            if ("?" in req):
                page = f"{req}&page[number]={i}"
            else:
                page = f"{req}?page[number]={i}"

            rawres = raw(page)
            res.extend(rawres.json())
            if (rawres.headers.get("X-Runtime") and float(rawres.headers.get("X-Total")) <= 0.5):
                mylogger(f"So fast", LOGGER_DEBUG)
                time.sleep(0.5)

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
