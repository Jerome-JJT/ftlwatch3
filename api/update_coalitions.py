


from _dbConnector import *
from _api import *
from dateutil import parser
import pytz

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def coalition_notification(fetched):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM coalitions WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://42lwatch.ch/basics/coalitions',
        'footer_text': datetime.datetime.now().astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }
    if fetched["image_url"] != None:
        embed["thumbnail"] = f'{fetched["image_url"]}'

    if (len(refer) == 0):
        embed['title'] = f'Created coalition {fetched["id"]}, {fetched["name"]}'
        refer = None
    else:
        embed['title'] = f'Updated coalition {fetched["id"]}, {fetched["name"]}'
        refer = refer[0]


    check_fields = ["name", "slug", "image_url", "cover_url", "color", "campus_id", "cursus_id", "bloc_id"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or refer[check] != fetched[check]):
            diffs[check] = f'ref: `{refer[check] if refer != None else None}`, new: `{fetched[check]}`'

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified coalition {fetched['id']} {fetched['name']}", LOGGER_INFO)
        send_to_rabbit('basics.server.message.queue', embed)

        
def bloc_callback(bloc):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    for coalition in bloc['coalitions']:
        mylogger(f"Import coalition {coalition['id']} {coalition['name']}", LOGGER_INFO)

        good = {
            "id": coalition["id"],
            "name": coalition["name"],
            "slug": coalition["slug"],
            "image_url": coalition["image_url"],
            "cover_url": coalition["cover_url"],
            "color": coalition["color"],
            "campus_id": bloc["campus_id"],
            "cursus_id": bloc["cursus_id"],
            "bloc_id": bloc["id"]
        }

        coalition_notification(good)

        executeQueryAction("""INSERT INTO coalitions (
            "id", "name", "slug", "image_url", "cover_url", 
            "color", "campus_id", "cursus_id", "bloc_id"
        ) VALUES (
            %(id)s, %(name)s, %(slug)s, %(image_url)s, %(cover_url)s, 
            %(color)s, %(campus_id)s, %(cursus_id)s, %(bloc_id)s
        )
        ON CONFLICT (id)
        DO UPDATE SET
            "name" = EXCLUDED.name,
            "slug" = EXCLUDED.slug,
            "image_url" = EXCLUDED.image_url,
            "cover_url" = EXCLUDED.cover_url,
            "color" = EXCLUDED.color,
            "campus_id" = EXCLUDED.campus_id,
            "cursus_id" = EXCLUDED.cursus_id,
            "bloc_id" = EXCLUDED.bloc_id
        """, good)

    return True

def import_coalitions():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start coalitions worker", LOGGER_ALERT)
    callapi("/v2/blocs?sort=id", True, bloc_callback, False)
    mylogger("End coalitions worker", LOGGER_ALERT)




if __name__ == "__main__":
    import_coalitions()