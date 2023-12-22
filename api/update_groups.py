


from _dbConnector import *
from _api import *
from dateutil import parser
import pytz

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def group_notification(fetched):
    from _utils_discord import discord_diff
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM groups WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://42lwatch.ch/basics/groups',
        'footer_text': datetime.datetime.now().astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }

    if (len(refer) == 0):
        embed['title'] = f'Created group {fetched["id"]}, {fetched["name"]}'
        refer = None
    else:
        embed['title'] = f'Updated group {fetched["id"]}, {fetched["name"]}'
        refer = refer[0]


    check_fields = ["name"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or refer[check] != fetched[check]):
            diffs[check] = discord_diff(refer, fetched, check)

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified group {fetched['id']} {fetched['name']}", LOGGER_INFO)
        send_to_rabbit('basics.server.message.queue', embed)



def group_callback(group):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import group {group['id']} {group['name']}", LOGGER_INFO)

    good = {
        "id": group["id"],
        "name": group["name"]
    }

    group_notification(good)

    executeQueryAction("""INSERT INTO groups (
        "id", "name"
    ) VALUES (
        %(id)s, %(name)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name
    """, good)

    return True

def import_groups():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start groups worker", LOGGER_ALERT)
    callapi("/v2/groups?sort=id", True, group_callback, False)
    mylogger("End groups worker", LOGGER_ALERT)




if __name__ == "__main__":
    import_groups()