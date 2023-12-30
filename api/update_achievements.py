


from _dbConnector import *
from _api import *
import datetime
from dateutil import parser
import pytz

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def achievement_notification(fetched):
    from _utils_discord import discord_diff
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM achievements WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://42lwatch.ch/basics/achievements',
        'footer_text': datetime.datetime.now().astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }
    if fetched["image"] != None:
        embed["thumbnail"] = f'https://cdn.intra.42.fr/{fetched["image"].replace("/uploads/", "")}'

    if (len(refer) == 0):
        embed['title'] = f'Created achievement {fetched["id"]}, {fetched["name"]}'
        refer = None
    else:
        embed['title'] = f'Updated achievement {fetched["id"]}, {fetched["name"]}'
        refer = refer[0]


    check_fields = ["name", "description", "kind", "image", "has_lausanne", "title_id"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or str(refer[check]) != str(fetched[check])):
            diffs[check] = discord_diff(refer, fetched, check)

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified achievement {fetched['id']} {fetched['name']}", LOGGER_INFO)
        send_to_rabbit('basics.server.message.queue', embed)



def achievement_callback(achievement):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import achievement {achievement['id']} {achievement['name']}", LOGGER_INFO)

    good = {
        "id": achievement["id"],
        "name": achievement["name"],
        "description": achievement["description"],
        "kind": achievement["kind"],
        "image": achievement["image"],
        "has_lausanne": "Lausanne" in achievement["campus"],
        "title_id": achievement["title"]["id"] if achievement["title"] != None else None
    }

    achievement_notification(good)

    executeQueryAction("""INSERT INTO achievements (
        "id", "name", "description", "kind", "image", "has_lausanne", "title_id"
    ) VALUES (
        %(id)s, %(name)s, %(description)s, %(kind)s, %(image)s, %(has_lausanne)s, %(title_id)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name,
        "description" = EXCLUDED.description,
        "kind" = EXCLUDED.kind,
        "image" = EXCLUDED.image,
        "has_lausanne" = EXCLUDED.has_lausanne,
        "title_id" = EXCLUDED.title_id
    """, good)


    return True

def import_achievements():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start achievements worker", LOGGER_ALERT)
    callapi("/v2/achievements?sort=id", True, achievement_callback, False)
    mylogger("End achievements worker", LOGGER_ALERT)





if __name__ == "__main__":
    import_achievements()