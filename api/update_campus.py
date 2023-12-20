


from _dbConnector import *
from _api import *
from dateutil import parser
import pytz

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def campus_notification(fetched):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM campus WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://42lwatch.ch/basics/campus',
        'footer_text': datetime.datetime.now().astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }

    if (len(refer) == 0):
        embed['title'] = f'Created campus {fetched["id"]}, {fetched["name"]}'
        refer = None
    else:
        embed['title'] = f'Updated campus {fetched["id"]}, {fetched["name"]}'
        refer = refer[0]


    check_fields = ["name", "timezone", "country", "city", "address", "website", "users_count"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or refer[check] != fetched[check]):
            diffs[check] = f'ref: `{refer[check] if refer != None else " "}`, new: `{fetched[check]}`'

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified campus {fetched['id']} {fetched['name']}", LOGGER_INFO)
        send_to_rabbit('basics.server.message.queue', embed)


def campus_callback(campus):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import campus {campus['id']} {campus['name']}", LOGGER_INFO)

    good = {
        "id": campus["id"],
        "name": campus["name"],
        "timezone": campus["time_zone"],
        "country": campus["country"],
        "city": campus["city"],
        "address": campus["address"],
        "website": campus["website"],
        "users_count": campus["users_count"]
    }

    campus_notification(good)

    executeQueryAction("""INSERT INTO campus (
        "id", "name", "timezone", 
        "country", "city", "address", "website", "users_count"
    ) VALUES (
        %(id)s, %(name)s, %(timezone)s, 
        %(country)s, %(city)s, %(address)s, %(website)s, %(users_count)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name,
        "timezone" = EXCLUDED.timezone,
        "country" = EXCLUDED.country,
        "city" = EXCLUDED.city,
        "address" = EXCLUDED.address,
        "website" = EXCLUDED.website,
        "users_count" = EXCLUDED.users_count
    """, good)


    return True

def import_campus():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start campus worker", LOGGER_ALERT)
    callapi("/v2/campus?sort=id", True, campus_callback, False)
    mylogger("End campus worker", LOGGER_ALERT)




if __name__ == "__main__":
    import_campus()