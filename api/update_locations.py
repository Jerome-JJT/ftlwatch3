

from _dbConnector import *
from _api import *
from dateutil import parser
import datetime
import click

from astral import LocationInfo
from astral.sun import sun

current_limit = 300
limit_checker = 300


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

    
def location_callback(location):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    global local_locations
    global current_limit
    global limit_checker

    if str(location["id"]) not in local_locations:
        current_limit = limit_checker

        if (location['begin_at'] == None or location['end_at'] == None):
            return True

        mylogger(f"Import location {location['id']} {location['host']}", LOGGER_INFO)

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



@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1, help="start at")

def import_locations(update_all=False, start_at=1):
    global local_locations
    from _utils_mylogger import mylogger, LOGGER_ALERT

    local_locations = executeQuerySelect("SELECT id FROM locations ORDER BY id DESC LIMIT 1000")
    local_locations = [one["id"] for one in local_locations] 

    if (len(local_locations) == 0):
        update_all = True

    if (update_all):
        mylogger("Start locations full worker", LOGGER_ALERT)
        callapi("/v2/campus/47/locations?sort=id", nultiple=start_at, callback=location_callback, callback_limit=False)
        mylogger("End locations full worker", LOGGER_ALERT)

    else:
        callapi(f"/v2/campus/47/locations?sort=-end_at", nultiple=1, callback=location_callback, callback_limit=True)




if __name__ == "__main__":
    import_locations()