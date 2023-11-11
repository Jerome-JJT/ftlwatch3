
import socket
import json


def logtologstash(logs):
  from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

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
    mylogger(f"Failed to connect socket {msg}", LOGGER_ERROR)
    return

  data = []
  for key, value in logs.items():
    data.append(f'"{key}": "{value}"')

  message = ", ".join(data)

  sock.send(message.encode('utf-8'))

  sock.close()

