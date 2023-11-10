
import socket
import json
import sys
import signal
from contextlib import contextmanager

LOGGER_DEBUG = 0
LOGGER_INFO = 1
LOGGER_WARNING = 2
LOGGER_ERROR = 3


def mylogger(log, level = 0):

  lvltotxt = ""

  if (level == 0):
    lvltotxt = "DEBUG"
  elif (level == 1):
    lvltotxt = "INFO"
  elif (level == 2):
    lvltotxt = "WARNING"
  elif (level == 3):
    lvltotxt = "ERROR"
  else:
    lvltotxt = "UNKNOWN"

  print(lvltotxt, log)

  # with open("res_watcher/_newsletter_errors.news", "a") as notif:
  #         print(f"req error {req}, ", file=notif)


def logtologstash(logs):
  HOST = 'logstash'
  PORT = 42113

  try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

  except socket.error as msg:
    mylogger("Failed to create socket", LOGGER_ERROR)
    return


  try:
    sock.connect((HOST, PORT))

  except socket.error as msg:
    mylogger("Failed to connect socket {msg}", LOGGER_ERROR)
    return

  data = []
  for key, value in logs.items():
    data.append(f'"{key}": "{value}"')

  message = ", ".join(data)

  sock.send(message.encode('utf-8'))

  sock.close()



@contextmanager
def timeout(time):
    signal.signal(signal.SIGALRM, raise_timeout)
    signal.alarm(time)

    try:
        yield
    except TimeoutError:
        pass
    finally:
        signal.signal(signal.SIGALRM, signal.SIG_IGN)


def raise_timeout(signum, frame):
    raise TimeoutError


def create_discord_payload(content = {}):
    payload = {
        "username": "BlazingDuck",
        "avatar_url": "https://dev.42lwatch.ch/static/logo_gray.png", 
        "embeds": [],
    }

    if (content.get('message_type') == 'embed'):
        embed = {
            "title": content["title"],
            "color": 32896, 
        }
        if (content.get("description") != None):
            embed["description"] = content.get("description")
        if (content.get("url") != None):
            embed["url"] = content.get("url")
        if (content.get("thumbnail") != None):
            embed["thumbnail"] = {
                "url": content.get("thumbnail")
            }

        if (content.get("image") != None):
            embed["image"] = {
                "url": content.get("image")
            }

        if (content.get("fields") != None):
            embed["fields"] = []
            for name, value in content.get("fields").items():
                embed["fields"].append({"name": name, "value": value})


        if (content.get("footer_text") != None or content.get("footer_icon") != None):
            embed["footer"] = {}
            if (content.get("footer_text")):
                embed["footer"]["text"] = content.get("footer_text")
            if (content.get("footer_icon")):
                embed["footer"]["icon_url"] = content.get("footer_icon")

        payload["embeds"].append(embed)

    else:
        payload["content"] = content["content"]

    return payload