


from _dbConnector import *
from _api import *
import json
import datetime
import pika

from update_achievements import import_achievements
from update_campus import import_campus
from update_coalitions import import_coalitions
from update_cursus import import_cursus
from update_groups import import_groups
from update_products import import_products
from update_projects import import_projects
from update_titles import import_titles
from update_users import import_users

from update_users_coals import import_users_coals
from update_users_points import import_users_points

from update_pdf import import_subjects
from process_pdf import process_pdf

from update_intranotif import import_intranotif

from update_events import import_events
from update_offers import import_offers
from update_locations import import_locations
from process_locations import process_locations
from update_teams import import_teams
from generate_love import gen_loves
from generate_peaks import gen_peaks
from generate_fall import gen_falls

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])


def custom_reject(ch, method, body, reason=""):
    new_properties = pika.BasicProperties(
        headers={'x-rejection-reason': f"Reject update {method.routing_key}, reason : {reason}"}
    )

    ch.basic_publish(
        exchange='',
        routing_key='update.dlq',
        properties=new_properties,
        body=body
    )

    ch.basic_ack(delivery_tag = method.delivery_tag)
    # ch.basic_reject(delivery_tag = method.delivery_tag, requeue=False)


def api_consumer(ch, method, properties, body, reject_first=False):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    if (reject_first == True):
        custom_reject(ch, method, body)
        return
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
            import_users(longway=True)
        elif (resource == "users_fast"):
            import_users(longway=False)


        elif (resource == "events"):
            import_events()

        elif (resource == "offers"):
            import_offers()

        elif (resource == "users_coals"):
            import_users_coals()

        elif (resource == "users_points"):
            import_users_points()

        elif (resource == "update_pdf"):
            import_subjects()
        elif (resource == "process_pdf"):
            process_pdf()


        elif (resource == "locations"):
            import_locations(mode="fast")
        elif (resource == "process_locations"):
            process_locations()

        elif (resource == "teams"):
            import_teams(mode="fast")
        elif (resource == "intranotif"):
            import_intranotif()


        elif (resource == "generate_love"):
            gen_loves()

        elif (resource == "generate_peaks"):
            gen_peaks()

        elif (resource == "generate_fall"):
            gen_falls()


        else:
            raise Exception(f'{resource} resource not found')

        mylogger(f"Consume api {method.routing_key}", LOGGER_INFO)
        ch.basic_ack(delivery_tag = method.delivery_tag)


    except Exception as e:
        mylogger(f"Reject api {method.routing_key}, type {type(e)}, reason {e}", LOGGER_ERROR)
        custom_reject(ch, method, body, reason=f"type {type(e)}, exception {e}")
        if ("ChannelClosedByBroker" in str(type(e))):
            mylogger(f"Reraise", LOGGER_ERROR)
            raise e

    return True
