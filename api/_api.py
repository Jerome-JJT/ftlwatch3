#!/usr/bin/env python3

import os
import glob
import sys
import time
import requests
import rich
import environ

env = environ.Env()
environ.Env.read_env()


# from _gettoken import *

# token = gettoken()
# token = request_token()


token = ""
tokencachefile = "/tmp/.token"

def test_token(token):
    return True

def get_headers(force_refresh = False):
    global token
    global tokencachefile

    if (len(token) == 0 and force_refresh == False):
        with open(f"{tokencachefile}", "r") as f:
            token = f.read()

        if (len(token) != 0):
            if (not test_token(token)):
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

        token_url = "https://api.intra.42.fr/v2/oauth/token"
        response = requests.post(token_url, data=request_token_payload)

        if(response.ok == True or response.status_code == 200):
            jsonres = response.json()
            
            print("OK", response.ok)
            print("HTTP", response.status_code)

            token = jsonres["access_token"]
            with open(f"tokencachefile", "w") as f:
                f.write(jsonres["access_token"])

    return {
        "Authorization": f"Bearer {token}"
    }



def callapi(req, multiple = False):

    rawreq = raw(req)
    res = rawreq.json()


    if (typeof(res) == typeof([]) and multiple == True): #rawreq.nb pages > 0
        for i in nbpage:
            res.extends(newres)

    resjson = []
    try:
        resjson = res.json()
    except requests.exceptions.JSONDecodeError:
        with open("res_watcher/_newsletter_errors.news", "a") as notif:
            print(f"req error {req}, ", file=notif)



def raw(req):
    auth = get_headers()

    if ("?" in req):
        url = f"https://api.intra.42.fr{req}"
    else:
        url = f"https://api.intra.42.fr{req}"
    print("REQ", url)

    fails = 0

    while (fails < 10)
        res = requests.get(url, headers=auth)

        if (res.status_code == 200):
            return res

        elif (res.status_code == 401):
            print("Token expired / Unauthorized")
            auth = get_headers(True)

        elif (res.status_code == 429):
            print("Timeout api")
            time.sleep(2)

    
    # throw


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


def pure(req):
    global token
    heads = {
        "Authorization": f"Bearer {token}"
    }

    if ("page[size" not in req):
        if ("?" in req):
            url = f"https://api.intra.42.fr{req}&page[size=100]"
        else:
            url = f"https://api.intra.42.fr{req}?page[size=100]"
    else:
        url = f"https://api.intra.42.fr{req}"
    print("REQ", url)

    flag = 0

    while (1):
        res = requests.get(url, headers=heads)

        if (res.status_code == 401 and flag < nbtoken()):
            print("Update token")
            token = request_token(flag)
            flag += 1
            heads = {
                "Authorization": f"Bearer {token}"
            }
        elif (res.status_code == 401):
            print("Token expired / Unauthorized")
            time.sleep(60)
        elif (res.status_code == 429 and flag < nbtoken()):
            print(f"Timeout api, update {flag}")
            token = request_token(flag)
            flag += 1
            heads = {
                "Authorization": f"Bearer {token}"
            }
        elif (res.status_code == 429):
            print("Timeout api")
            time.sleep(60)
        else:
            break

    resjson = []
    try:
        resjson = res.json()
    except requests.exceptions.JSONDecodeError:
        with open("res_watcher/_newsletter_errors.news", "a") as notif:
            print(f"req error {req}, ", file=notif)

    return (resjson)





# def post(req):
#     global token
#     heads = {
#         "Authorization": f"Bearer {token}"
#     }
#
#     if ("?" in req):
#         url = f"https://api.intra.42.fr{req}"
#     else:
#         url = f"https://api.intra.42.fr{req}"
#
#     flag = 0
#
#     while (1):
#         res = requests.post(url, headers=heads)
#
#         if (res.status_code == 401 and flag < nbtoken()):
#             print("Update token")
#             token = request_token()
#             flag += 1
#             heads = {
#                 "Authorization": f"Bearer {token}"
#             }
#         elif (res.status_code == 401):
#             print("Token expired / Unauthorized")
#             return (res)
#         elif (res.status_code == 429 and flag < nbtoken()):
#             print(f"Timeout api, update {flag}")
#             token = request_token(flag)
#             flag += 1
#             heads = {
#                 "Authorization": f"Bearer {token}"
#             }
#         elif (res.status_code == 429):
#             print("Timeout api")
#             time.sleep(60)
#         else:
#             break
#     return (res.json())


def mpure(req):
    global token
    heads = {
        "Authorization": f"Bearer {token}"
    }

    full = []

    if ("page[size" not in req):
        if ("?" in req):
            url = f"https://api.intra.42.fr{req}&page[size=100]"
        else:
            url = f"https://api.intra.42.fr{req}?page[size=100]"
    else:
        url = f"https://api.intra.42.fr{req}"

    print("REQ", url)
    flag = 0

    while (1):
        res = requests.get(url, headers=heads)

        if (res.status_code == 401 and flag < nbtoken()):
            print("Update token")
            token = request_token()
            flag += 1
            heads = {
                "Authorization": f"Bearer {token}"
            }
        elif (res.status_code == 401):
            print("Token expired / Unauthorized")
            return (res)
        elif (res.status_code == 429 and flag < nbtoken()):
            print(f"Timeout api, update {flag}")
            token = request_token(flag)
            flag += 1
            heads = {
                "Authorization": f"Bearer {token}"
            }
        elif (res.status_code == 429):
            print("Timeout api")
            time.sleep(60)
        else:
            break
    full.extend(res.json())

    flag = 0

    num = 2
    while True:
        time.sleep(0.6)
        page = f"{url}&page[number]={num}"
        print("REQ", page)

        while (1):
            res = requests.get(page, headers=heads)

            if (res.status_code == 401 and flag < nbtoken()):
                print("Update token")
                token = request_token()
                flag += 1
                heads = {
                    "Authorization": f"Bearer {token}"
                }
            elif (res.status_code == 401):
                print("Token expired / Unauthorized")
                return (res)
            elif (res.status_code == 429 and flag < nbtoken()):
                print(f"Timeout api, update {flag}")
                token = request_token(flag)
                flag += 1
                heads = {
                    "Authorization": f"Bearer {token}"
                }
            elif (res.status_code == 429):
                print("Timeout api")
                time.sleep(60)
            else:
                break

        if (len(res.json()) == 0):
            break
        full.extend(res.json())
        num += 1

    time.sleep(0.6)
    return (full)



def api(req, list=[], file=""):
    global token
    heads = {
        "Authorization": f"Bearer {token}"
    }

    if ("?" in req):
        url = f"https://api.intra.42.fr{req}&page[size=100]"
    else:
        url = f"https://api.intra.42.fr{req}?page[size=100]"

    print("REQ", url)
    res = requests.get(url, headers=heads)

    full = []

    if (res.status_code == 401):
        print("Token expired / Unauthorized")
        return (res)

    #if (len(file) > 0):
    #    file = f"{apilogfolder}{file}"
    #    fi = open(file, "w")
    #    fi.close()

    showres(res, list)
    full.extend(res.json())
    time.sleep(0.6)

    num = 2
    while True:
        page = f"{url}&page[number]={num}"
        print("REQ", page)
        res = requests.get(page, headers=heads)

        if (res.status_code == 401):
            print("Token expired / Unauthorized")
            return (res)

        if (len(res.json()) == 0):
            break
        showres(res, list)
        full.extend(res.json())
        time.sleep(0.6)
        num += 1

    return (full)
