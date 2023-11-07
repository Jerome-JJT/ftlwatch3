


from _utils import *
from _dbConnector import *
from _api import *
import json

from update_achievements import import_achievements
from update_campus import import_campus
from update_coalitions import import_coalitions
from update_cursus import import_cursus
from update_groups import import_groups
from update_products import import_products
from update_projects import import_projects
from update_titles import import_titles
from update_users import import_users

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def api_consumer(ch, method, properties, body):

    # ch.basic_ack(delivery_tag = method.delivery_tag)
    # ch.basic_reject(delivery_tag = method.delivery_tag, requeue=False)

    try:
        content = json.loads(body)


        resource = content["resource"]


        if (resource == "achievements"):
            import_achievements()
            
        elif (resource == "campus"):
            import_campus()
            
        elif (resource == "coalitions"):
            import_coalitions()
            
        elif (resource == "cursus"):
            import_cursus()
            
        elif (resource == "groups"):
            import_groups()
            
        elif (resource == "products"):
            import_products()
            
        elif (resource == "projects"):
            import_projects()
            
        elif (resource == "titles"):
            import_titles()

        elif (resource == "users"):
            import_users()

        else:
            raise Exception(f'{resource} resource not found')

        mylogger(f"Consume api {method.routing_key}", LOGGER_INFO)
        ch.basic_ack(delivery_tag = method.delivery_tag)


    except Exception as e:
        mylogger(f"Reject api {method.routing_key}, type {type(e)}, reason {e}", LOGGER_ERROR)
        ch.basic_reject(delivery_tag = method.delivery_tag, requeue=False)

    return True
