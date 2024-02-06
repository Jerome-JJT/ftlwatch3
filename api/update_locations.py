

from _dbConnector import *
from _api import *
from dateutil import parser
import datetime
import click
import pytz

from astral import LocationInfo
from astral.sun import sun

current_limit = 150
limit_checker = 150


city = LocationInfo("Switzerland", "Renens", "Europe/Zurich", 46.533, 6.591)


def sun_values(date, sit1):
    sun_time = 0
    moon_time = 0

    s = sun(city.observer, date=date)

    sun_sit = {}
    sun_sit["begin_at"] = s["sunrise"].replace(tzinfo=None)
    sun_sit["end_at"] = s["sunset"].replace(tzinfo=None)

    sit1["begin_at"] = sit1["begin_at"].replace(tzinfo=None)
    sit1["end_at"] = sit1["end_at"].replace(tzinfo=None)

    # sit1    |-------------------|
    # sun         |------|
    if (sit1["begin_at"] < sun_sit["begin_at"] and sit1["end_at"] > sun_sit["end_at"]):
        moon_time += (sun_sit["begin_at"] - sit1["begin_at"]).total_seconds()
        sun_time += (sun_sit["end_at"] - sun_sit["begin_at"]).total_seconds()
        moon_time += (sit1["end_at"] - sun_sit["end_at"]).total_seconds()

    # sit1        |-------|
    # sun    |---------------|
    elif (sit1["begin_at"] > sun_sit["begin_at"] and sit1["end_at"] < sun_sit["end_at"]):
        sun_time += (sit1["end_at"] - sit1["begin_at"]).total_seconds()

    # sit1    |------------|
    # sun           |-----------|
    elif (sit1["end_at"] > sun_sit["begin_at"] and sit1["end_at"] < sun_sit["end_at"]):
        moon_time += (sun_sit["begin_at"] - sit1["begin_at"]).total_seconds()
        sun_time += (sit1["end_at"] - sun_sit["begin_at"]).total_seconds()

    # sit1         |------------|
    # sun    |------------|
    elif (sit1["begin_at"] > sun_sit["begin_at"] and sit1["begin_at"] < sun_sit["end_at"]):
        sun_time += (sun_sit["end_at"] - sit1["begin_at"]).total_seconds()
        moon_time += (sit1["end_at"] - sun_sit["end_at"]).total_seconds()

    # sit1  |---|          |----|
    # sun          |----|
    else:
        moon_time += (sit1["end_at"] - sit1["begin_at"]).total_seconds()

    return (sun_time, moon_time)



def location_notification(fetched):
    from _utils_discord import discord_diff
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    locations_active = executeQuerySelect("SELECT id FROM locations_active WHERE id = %(id)s", {
        "id": str(fetched["id"])
    })
    locations = executeQuerySelect("SELECT id FROM locations WHERE id = %(id)s", {
        "id": str(fetched["id"])
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://profile.intra.42.fr/users/{fetched["user"]["login"]}'
    }
    if fetched.get("user") != None and fetched.get("user").get("image") != None and fetched.get("user").get("image").get("link") != None:
        embed["thumbnail"] = fetched.get("user").get("image").get("link")


    if (fetched["end_at"] == None and len(locations_active) == 0):
        embed['title'] = f'{fetched["user"]["login"]} logged on {fetched["host"]}'
        embed['description'] = f'Connected at <t:{int(parser.parse(fetched["begin_at"]).timestamp())}:f>\n{fetched["host"]}'
        embed['footer_text'] = parser.parse(fetched["begin_at"]).astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')

        mylogger(f"Nofified location {fetched['id']} {fetched['host']}", LOGGER_INFO)
        send_to_rabbit('locations.server.message.queue', embed)


    elif (fetched["end_at"] != None and len(locations) == 0):
        embed['title'] = f'{fetched["user"]["login"]} unlogged on {fetched["host"]}'
        embed['description'] = f'Disconnected at <t:{int(parser.parse(fetched["end_at"]).timestamp())}:f>\n{fetched["host"]}'
        embed['footer_text'] = parser.parse(fetched["end_at"]).astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
        
        mylogger(f"Nofified location {fetched['id']} {fetched['host']}", LOGGER_INFO)
        send_to_rabbit('locations.server.message.queue', embed)


    
def location_callback(location):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    global local_locations
    global current_limit
    global limit_checker

    if str(location["id"]) not in local_locations:
        current_limit = limit_checker

        location_notification(location)

        if (location['end_at'] == None):
            executeQueryAction("""INSERT INTO locations_active ("id") VALUES (%(id)s)
                ON CONFLICT DO NOTHING
                """, {
                "id": location["id"]
            })
            return True
        
        elif (location['begin_at'] == None or location['end_at'] == None):
            return True

        mylogger(f"Import location {location['id']} {location['host']} / current_limit = {current_limit}", LOGGER_INFO)

        good_start_date = location['begin_at'][:10]
        good_end_date = location['end_at'][:10]

        begin_at = parser.parse(location["begin_at"])
        end_at = parser.parse(location["end_at"])

        good_length = (end_at.replace(tzinfo=None) - begin_at.replace(tzinfo=None)).total_seconds()

        piscine_concern = f"{location['user']['pool_year'] if location['user']['pool_year'] else '2000'}-10-01"
        good_is_piscine = good_start_date < piscine_concern


        if (good_start_date == good_end_date):
            sun_times = sun_values(begin_at, {"begin_at": begin_at, "end_at": end_at})

            executeQueryAction("""INSERT INTO locations (
                "id", "begin_at", "end_at", "date", "length", "sun_length", "moon_length", 
                "is_piscine", "host", "user_id"
                ) VALUES (
                %(id)s, %(begin_at)s, %(end_at)s, %(date)s, %(length)s, %(sun_length)s, %(moon_length)s, 
                %(is_piscine)s, %(host)s, %(user_id)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": location["id"], 
                "begin_at": location["begin_at"],
                "end_at": location["end_at"],
                "date": good_start_date,
                "length": good_length,
                "sun_length": sun_times[0],
                "moon_length": sun_times[1],
                "is_piscine": good_is_piscine,
                "host": location["host"],
                "user_id": location["user"]["id"],
            })

        else:
            date1 = begin_at.date()
            date2 = end_at.date()

            midnight = datetime.datetime(date2.year, date2.month, date2.day, 0, 0, 0)

            first_length = (midnight.replace(tzinfo=None) - begin_at.replace(tzinfo=None)).total_seconds()
            second_length = (end_at.replace(tzinfo=None) - midnight.replace(tzinfo=None)).total_seconds()

            sun_start_times = sun_values(begin_at, {"begin_at": begin_at, "end_at": midnight})
            sun_end_times = sun_values(end_at, {"begin_at": midnight, "end_at": end_at})
            
            executeQueryAction("""INSERT INTO locations (
                "id", "begin_at", "end_at", "date", "length", "sun_length", "moon_length", 
                "is_piscine", "host", "user_id"
                ) VALUES (
                %(id)s, %(begin_at)s, %(end_at)s, %(date)s, %(length)s, %(sun_length)s, %(moon_length)s, 
                %(is_piscine)s, %(host)s, %(user_id)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": f'{location["id"]}_bis', 
                "begin_at": location["begin_at"],
                "end_at": midnight,
                "date": good_start_date,
                "length": first_length,
                "sun_length": sun_start_times[0],
                "moon_length": sun_start_times[1],
                "is_piscine": good_is_piscine,
                "host": location["host"],
                "user_id": location["user"]["id"],
            })

            executeQueryAction("""INSERT INTO locations (
                "id", "begin_at", "end_at", "date", "length", "sun_length", "moon_length", 
                "is_piscine", "host", "user_id"
                ) VALUES (
                %(id)s, %(begin_at)s, %(end_at)s, %(date)s, %(length)s, %(sun_length)s, %(moon_length)s, 
                %(is_piscine)s, %(host)s, %(user_id)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": location["id"], 
                "begin_at": midnight,
                "end_at": location["end_at"],
                "date": good_end_date,
                "length": second_length,
                "sun_length": sun_end_times[0],
                "moon_length": sun_end_times[1],
                "is_piscine": good_is_piscine,
                "host": location["host"],
                "user_id": location["user"]["id"],
            })
    else:
        current_limit -= 1

    return (current_limit > 0)




def import_locations(update_all=False, start_at=1, mode="slow"):
    global local_locations
    global limit_checker
    global current_limit
    from _utils_mylogger import mylogger, LOGGER_ALERT

    current_limit = 150
    limit_checker = 150


    local_locations = executeQuerySelect("SELECT id FROM locations ORDER BY id DESC LIMIT 1000")
    local_locations = [one["id"] for one in local_locations] 

    if (len(local_locations) == 0):
        update_all = True

    if (update_all):
        mylogger("Start locations full worker", LOGGER_ALERT)
        callapi("/v2/campus/47/locations?sort=id", nultiple=start_at, callback=location_callback, callback_limit=False, mode=mode)
        mylogger("End locations full worker", LOGGER_ALERT)

    else:
        callapi(f"/v2/campus/47/locations?sort=-end_at", nultiple=1, callback=location_callback, callback_limit=True, mode=mode)



@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1, help="start at")

def starter(update_all=False, start_at=1):
    import_locations(update_all, start_at)

if __name__ == "__main__":
    starter()