


from _utils import *
from _dbConnector import *
from _api import *
# from dateutil.parser import parse
from dateutil import parser
import datetime



# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

local_locations = []

current_limit = 300
limit_checker = 300


def location_callback(location):
    global local_locations
    global current_limit
    global limit_checker

    if location["id"] not in local_locations:
        current_limit = limit_checker
        mylogger(f"Import location {location['id']} {location['host']}", LOGGER_INFO)

        if (location['begin_at'] == None or location['end_at'] == None):
            return True

        good_start_date = location['begin_at'][:10]
        good_end_date = location['end_at'][:10]

        begin_at = parser.parse(location["begin_at"])
        end_at = parser.parse(location["end_at"])

        good_length = (end_at.replace(tzinfo=None) - begin_at.replace(tzinfo=None)).total_seconds()

        piscine_concern = f"{good_start_date[:4]}-10-01"
        good_is_piscine = piscine_concern < good_start_date

        if (good_start_date == good_end_date):
            executeQueryAction("""INSERT INTO locations (
                "id", "begin_at", "end_at", "date", "length", "is_piscine", "host", "user_id"
                ) VALUES (
                %(id)s, %(begin_at)s, %(end_at)s, %(date)s, %(length)s, %(is_piscine)s, %(host)s, %(user_id)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": location["id"], 
                "begin_at": location["begin_at"],
                "end_at": location["end_at"],
                "date": good_start_date,
                "length": good_length,
                "is_piscine": good_is_piscine,
                "host": location["host"],
                "user_id": location["user"]["id"],
            })
        else:
            

            date1 = begin_at.date()
            date2 = end_at.date()

            midnight_start = datetime.datetime(date1.year, date1.month, date1.day, 0, 0, 0)
            midnight_end = datetime.datetime(date2.year, date2.month, date2.day, 0, 0, 0)

            first_length = (begin_at.replace(tzinfo=None) - midnight_start.replace(tzinfo=None)).total_seconds()
            second_length = (midnight_end.replace(tzinfo=None) - end_at.replace(tzinfo=None)).total_seconds()


            executeQueryAction("""INSERT INTO locations (
                "id", "begin_at", "end_at", "date", "length", "is_piscine", "host", "user_id"
                ) VALUES (
                %(id)s, %(begin_at)s, %(end_at)s, %(date)s, %(length)s, %(is_piscine)s, %(host)s, %(user_id)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": f'{location["id"]}_bis', 
                "begin_at": location["begin_at"],
                "end_at": midnight_start,
                "date": good_start_date,
                "length": first_length,
                "is_piscine": good_is_piscine,
                "host": location["host"],
                "user_id": location["user"]["id"],
            })

            executeQueryAction("""INSERT INTO locations (
                "id", "begin_at", "end_at", "date", "length", "is_piscine", "host", "user_id"
                ) VALUES (
                %(id)s, %(begin_at)s, %(end_at)s, %(date)s, %(length)s, %(is_piscine)s, %(host)s, %(user_id)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": location["id"], 
                "begin_at": midnight_end,
                "end_at": location["end_at"],
                "date": good_end_date,
                "length": second_length,
                "is_piscine": good_is_piscine,
                "host": location["host"],
                "user_id": location["user"]["id"],
            })
    else:
        current_limit -= 1

    return (current_limit > 0)


def import_locations(update_all = False):
    global local_locations

    local_locations = executeQuerySelect("SELECT id FROM locations ORDER BY id DESC LIMIT 1000")
    local_locations = [one["id"] for one in local_locations] 

    if (len(local_locations) == 0):
        update_all = True

    update_all = True # Titles route is broken

    if (update_all):
        callapi("/v2/campus/47/locations?sort=id", True, location_callback, False)
    else:
        callapi(f"/v2/campus/47/locations?sort=-id", True, location_callback, True)




if __name__ == "__main__":
    import_locations(True)