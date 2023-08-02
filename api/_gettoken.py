#!/usr/bin/env python3

import os
import datetime
import requests
import requests
import sys

from _myfunctions import *

from oauthlib.oauth2 import WebApplicationClient


tokenfile = ".token"
intratokenfile = ".intratokenfile"
token = ""

# def intratoken():
#    return ("")

def nbtoken():
    return (2)

def apiuid(i = 0):
    if (i == 0):
        return ("")
    else:
        return ("")

def apisecret(i = 0):
    if (i == 0):
        return ("")
    else:
        return ("")




def getintratoken(i = 0):
    if (i > 5):
        return ("null")

    if os.path.isfile(intratokenfile):
        with open(intratokenfile, "r") as f:
            lines = f.readlines()
            f.close()

            for line in lines:
                if ("_intra_42_session_production" in line):
                    token = line.split()[-1]

                    res = readpage("", token)
                    if (res == "error"):
                        return (request_intratoken(i + 1))

                    return (token)

    return (request_intratoken(i + 1))

def request_intratoken(i = 0):
    os.system("bash _autologger.sh")
    return (getintratoken(i + 1))



def gettoken(i = 0):
    if os.path.isfile(f"{tokenfile}{i}"):
        with open(f"{tokenfile}{i}", "r") as f:
            lines = f.readlines()
            f.close()

            if (len(lines) == 2):
                token = lines[0].strip()
                exp_date = datetime.datetime.strptime(lines[1].strip(), "%Y-%m-%d %H:%M:%S") - datetime.datetime.now()


                if (exp_date.total_seconds() < 0):
                    return (request_token(i))

                print("old expires at", lines[1].strip())
                return (token)
            else:
                return (request_token(i))
    else:
        return (request_token(i))
