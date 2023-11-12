


from _dbConnector import *
from _api import *
import json
import datetime

from update_achievements import import_achievements
from update_campus import import_campus
from update_coalitions import import_coalitions
from update_cursus import import_cursus
from update_groups import import_groups
from update_products import import_products
from update_projects import import_projects
from update_titles import import_titles
from update_users import import_users
from generate_love import generate_love

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def api_consumer(ch, method, properties, body):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

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

        elif (resource == "generate_love"):
            import_users()
            target_date = datetime.datetime(datetime.datetime.now().year, 10, 1)
            target_date = target_date.strftime("%Y-%m-%d")

            generate_love(output_name='love_piscine_2d', is_piscine=True)
            generate_love(output_name='love_all_2d')
            generate_love(output_name='love_recent_2d', is_piscine=False, min_date=target_date)

            generate_love(graph_type="3d", output_name='love_piscine_3d', is_piscine=True)
            generate_love(graph_type="3d", output_name='love_all_3d')
            generate_love(graph_type="3d", output_name='love_recent_3d', is_piscine=False, min_date=target_date)


        else:
            raise Exception(f'{resource} resource not found')

        mylogger(f"Consume api {method.routing_key}", LOGGER_INFO)
        ch.basic_ack(delivery_tag = method.delivery_tag)


    except Exception as e:
        mylogger(f"Reject api {method.routing_key}, type {type(e)}, reason {e}", LOGGER_ERROR)
        ch.basic_reject(delivery_tag = method.delivery_tag, requeue=False)

    return True
