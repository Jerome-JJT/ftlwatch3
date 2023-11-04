
import socket
import json
import sys

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
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

  except socket.error as msg:
    mylogger("Failed to create socket", LOGGER_ERROR)
    return


  try:
    sock.connect((HOST, PORT))

  except socket.error as msg:
    mylogger("Failed to connect socket", LOGGER_ERROR)
    return

  data = []
  for key, value in logs.items():
    data.append(f'"{key}": "{value}"')

  message = ", ".join(data)

  sock.send(message.encode('utf-8'))

  sock.close()