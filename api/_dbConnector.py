import psycopg2
import psycopg2.extras
import environ

env = environ.Env()
environ.Env.read_env()



def executeQuerySelect(query, data = {}):
  from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

  try:
    conn = openDBConnection()
    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

    # cur.prepare()
    cur.execute(query, data)
    queryResult = cur.fetchall()
    cur.close()
    conn.close()
    queryResult = list(map(lambda row: dict(row), queryResult))

    return queryResult

  except Exception as e:
    mylogger(f"Caught exception query select {str(e).rstrip()}", LOGGER_ERROR)
    raise e



def executeQueryAction(query, data = {}, repeat = False):
  from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

  try:
    conn = openDBConnection()
    cur = conn.cursor()
    result = True

    if(not repeat):
      cur.execute(query, data)

    else:
      for value in data:
        cur.execute(query, value)

    conn.commit()
    cur.close()
    conn.close()
    return result

  except Exception as e:
    mylogger(f"Caught exception query action {str(e).rstrip()}", LOGGER_ERROR)
    raise e



def openDBConnection():
  from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR


  try:
    conn = psycopg2.connect(
      host = env('DATABASE_HOST'),
      port = env('DATABASE_PORT'),
      database = env('DATABASE_DB'),
      user = env('DATABASE_USER'),
      password = env('DATABASE_PASSWORD')
    )
    return conn
    
  except Exception as e:
    mylogger(f"openDBConnection {type(e)} {str(e).rstrip()}")
    raise e
    