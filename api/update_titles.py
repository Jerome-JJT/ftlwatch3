


from _dbConnector import *
from _api import *
from dateutil import parser
import pytz

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def title_notification(fetched):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM titles WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://42lwatch.ch/basics/titles',
        'footer_text': datetime.datetime.now().astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }

    if (len(refer) == 0):
        embed['title'] = f'Created title {fetched["id"]}, {fetched["name"]}'
        refer = None
    else:
        embed['title'] = f'Updated title {fetched["id"]}, {fetched["name"]}'
        refer = refer[0]


    check_fields = ["name"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or refer[check] != fetched[check]):
            diffs[check] = f'ref: `{refer[check] if refer != None else " "}`, new: `{fetched[check]}`'

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified title {fetched['id']} {fetched['name']}", LOGGER_INFO)
        send_to_rabbit('basics.server.message.queue', embed)


def title_callback(title):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import title {title['id']} {title['name']}", LOGGER_INFO)

    good = {
        "id": title["id"],
        "name": title["name"]
    }

    title_notification(good)

    executeQueryAction("""INSERT INTO titles (
        "id", "name"
    ) VALUES (
        %(id)s, %(name)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name
    """, good)

    return True

def import_titles():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start titles worker", LOGGER_ALERT)
    callapi("/v2/titles?sort=id", True, title_callback, False)
    mylogger("End titles worker", LOGGER_ALERT)


if __name__ == "__main__":
    import_titles()