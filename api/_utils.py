
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