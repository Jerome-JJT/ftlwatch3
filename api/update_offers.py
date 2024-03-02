


from _dbConnector import *
from _api import *
from dateutil import parser
import click
import pytz

local_offers = []

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def offer_notification(fetched):
    from _utils_discord import discord_diff
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM offers WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://42lwatch.ch/basics/offers',
        'footer_text': datetime.datetime.now().astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }

    if (len(refer) == 0):
        embed['title'] = f'Created offer {fetched["id"]}, {fetched["title"]}'
        refer = None
    else:
        embed['title'] = f'Updated offer {fetched["id"]}, {fetched["title"]}'
        refer = refer[0]


    check_fields = ["title", "salary", "address", "valid_at", "invalid_at", "little_description", "big_description"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or str(refer[check]) != str(fetched[check])):
            diffs[check] = discord_diff(refer, fetched, check)

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified offer {fetched['id']} {fetched['title']}", LOGGER_INFO)
        send_to_rabbit('offers.server.message.queue', embed)

        
def offer_callback(offer):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    global local_teams
    global limit_checker
    global current_limit


    mylogger(f"Import offer {offer['id']} {offer['title']} / current_limit = {current_limit}", LOGGER_INFO)

    good = {
        "id": offer["id"], 
        "title": offer["title"],
        "salary": offer["salary"],
        "address": offer["full_address"],

        "valid_at": offer["valid_at"],
        "invalid_at": offer["invalid_at"],

        "little_description": offer["little_description"][:1000],
        "big_description": offer["big_description"][:1000],

        "created_at": offer["created_at"]
    }

    if "Switzerland" in good["address"]:
        offer_notification({**good})

    executeQueryAction("""INSERT INTO offers (
        "id", "title", "salary", "address", 
        "valid_at", "invalid_at",
        "little_description", "big_description", 
        "created_at"
        
        ) VALUES (

        %(id)s, %(title)s, %(salary)s, %(address)s, 
        %(valid_at)s, %(invalid_at)s,
        %(little_description)s, %(big_description)s, 
        %(created_at)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        title = EXCLUDED.title,
        salary = EXCLUDED.salary,
        address = EXCLUDED.address,
        valid_at = EXCLUDED.valid_at,
        invalid_at = EXCLUDED.invalid_at,
        little_description = EXCLUDED.little_description,
        big_description = EXCLUDED.big_description,
        created_at = EXCLUDED.created_at
    """, good)

    if offer["id"] not in local_offers:
        current_limit = limit_checker
    else:
        current_limit -= 1

    return (current_limit > 0)




def import_interships(update_all=False, start_at=1, mode="slow"):
    global local_offers
    global limit_checker
    global current_limit
    from _utils_mylogger import mylogger, LOGGER_ALERT

    current_limit = 150
    limit_checker = 150

    local_offers = executeQuerySelect("SELECT id FROM offers ORDER BY id DESC")
    local_offers = [one['id'] for one in local_offers] 

    if (len(local_offers) == 0):
        update_all = True

    if (update_all):
        mylogger("Start offers full worker", LOGGER_ALERT)
        callapi("/v2/offers?sort=id", nultiple=start_at, callback=offer_callback, callback_limit=False, mode=mode)
        mylogger("End offers full worker", LOGGER_ALERT)

    else:
        callapi(f"/v2/offers?sort=-updated_at", nultiple=1, callback=offer_callback, callback_limit=True, mode=mode)


@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1, help="start at")

def starter(update_all=False, start_at=1):
    import_interships(update_all, start_at)


if __name__ == "__main__":
    starter()