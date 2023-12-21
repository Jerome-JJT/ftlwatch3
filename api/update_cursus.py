


from _dbConnector import *
from _api import *
from dateutil import parser
import pytz

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def cursus_notification(fetched):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM cursus WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://42lwatch.ch/basics/cursus',
        'footer_text': parser.parse(fetched["updated_at"]).astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }

    if (len(refer) == 0):
        embed['title'] = f'Created cursus {fetched["id"]}, {fetched["name"]}'
        refer = None
    else:
        embed['title'] = f'Updated cursus {fetched["id"]}, {fetched["name"]}'
        refer = refer[0]


    check_fields = ["name", "slug", "kind"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or refer[check] != fetched[check]):
            diffs[check] = f'ref: `{refer[check] if (refer != None and refer[check] != None and refer[check] != "") else "None"}`, new: `{fetched[check]}`'

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified cursus {fetched['id']} {fetched['name']}", LOGGER_INFO)
        send_to_rabbit('basics.server.message.queue', embed)


def cursus_callback(cursus):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import cursus {cursus['id']} {cursus['name']}", LOGGER_INFO)

    good = {
        "id": cursus["id"],
        "name": cursus["name"],
        "slug": cursus["slug"],
        "kind": cursus["kind"]
    }

    cursus_notification(good)

    executeQueryAction("""INSERT INTO cursus (
        "id", "name", "slug", "kind"
    ) VALUES (
        %(id)s, %(name)s, %(slug)s, %(kind)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name,
        "slug" = EXCLUDED.slug,
        "kind" = EXCLUDED.kind
    """, good)

    return True

def import_cursus():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start cursus worker", LOGGER_ALERT)
    callapi("/v2/cursus?sort=id", True, cursus_callback, False)
    mylogger("End cursus worker", LOGGER_ALERT)


if __name__ == "__main__":
    import_cursus()