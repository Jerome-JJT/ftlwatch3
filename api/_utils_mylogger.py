
from _rabbit import send_to_rabbit

LOGGER_DEBUG = 0
LOGGER_INFO = 1
LOGGER_WARNING = 2
LOGGER_ERROR = 3

LOGGER_ALERT = 10


def mylogger(log, level = 0, rabbit = True):

  lvltotxt = ""

  if (level == 0):
    lvltotxt = "DEBUG"
  elif (level == 1):
    lvltotxt = "INFO"
  elif (level == 2):
    lvltotxt = "WARNING"
  elif (level == 3):
    lvltotxt = "ERROR"
  elif (level == 10):
    lvltotxt = "ALERT"
  else:
    lvltotxt = "UNKNOWN"

  print(lvltotxt, log)

  if (level >= LOGGER_WARNING and rabbit):
    send_to_rabbit('errors.server.message.queue', {'content': f'{lvltotxt}, {log}'})

