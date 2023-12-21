


from _dbConnector import *
from _api import *
# from dateutil.parser import parse
from dateutil import parser
import datetime
from _hosts import host_locations


local_locations = []

current_limit = 150
limit_checker = 150


def process_locations(update_all = False):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR, LOGGER_ALERT

    global local_locations
    mylogger("Start locations processor", LOGGER_ALERT)

    days_done = []
    if (update_all == False):
            days_done = executeQuerySelect("select DISTINCT date from vp_loves")
            days_done = [one["date"] for one in days_done] 

    days = executeQuerySelect("select DISTINCT date from locations")
    days = [one["date"] for one in filter(lambda d: d["date"] not in days_done, days)] 
    days.sort()

    all_hosts = host_locations()

    for day in days[:-2]:
        locates = executeQuerySelect("""SELECT locations.id, locations.begin_at, locations.end_at, locations.is_piscine, locations.host, locations.user_id 
                                     FROM locations 
                                     JOIN users ON users.id = locations.user_id 
                                     WHERE date = %(date)s AND users.kind <> 'external'""", {
            "date": day
        })

        day_peaks =         {"total": 0, "total_same": 0, "peak_at": day}
        day_peaks_piscine = {"total": 0, "total_same": 0, "peak_at": day}

        for i, sit1 in enumerate(locates):

            if (sit1["host"] not in all_hosts.keys()):
                continue

            print(day, f"{i}/{len(locates)}")
            
            peaks = [sit1["user_id"]]
            same_peaks = [sit1["user_id"]]

            for sit2 in locates:

                if (sit2["host"] not in all_hosts.keys()):
                    continue

                if (sit2["user_id"] not in peaks and sit1["is_piscine"] == sit2["is_piscine"]):
                    peaks.append(sit2["user_id"])

                if (sit2["user_id"] not in same_peaks and sit1["is_piscine"] == sit2["is_piscine"] and 
                    (sit1["begin_at"] >= sit2["begin_at"] and sit1["begin_at"] <= sit2["end_at"])):
                    same_peaks.append(sit2["user_id"])

                if (sit2["id"] <= sit1["id"]):
                    continue


                host1 = all_hosts[sit1["host"]]
                host2 = all_hosts[sit2["host"]]

                dist = math.sqrt(math.pow(host1["x"] - host2["x"], 2) + math.pow(host1["y"] - host2["y"], 2))
                if (dist > 90):
                    continue

                length = 0

                # sit1    |-------------------|
                # sit2        |------|
                if (sit1["begin_at"] < sit2["begin_at"] and sit1["end_at"] > sit2["end_at"]):
                    length = (sit2["end_at"] - sit2["begin_at"]).total_seconds()

                # sit1        |-------|
                # sit2   |---------------|
                elif (sit1["begin_at"] > sit2["begin_at"] and sit1["end_at"] < sit2["end_at"]):
                    length = (sit1["end_at"] - sit1["begin_at"]).total_seconds()

                # sit1    |------------|
                # sit2          |-----------|
                elif (sit1["end_at"] > sit2["begin_at"] and sit1["end_at"] < sit2["end_at"]):
                    length = (sit1["end_at"] - sit2["begin_at"]).total_seconds()

                # sit1         |------------|
                # sit2   |------------|
                elif (sit1["begin_at"] > sit2["begin_at"] and sit1["begin_at"] < sit2["end_at"]):
                    length = (sit2["end_at"] - sit1["begin_at"]).total_seconds()


                if (length <= 0):
                    continue

                good_ids = [sit1["id"], sit2["id"]]
                good_ids.sort()
                good_id = "_".join(good_ids)

                executeQueryAction("""INSERT INTO vp_loves (
                    "id", "user1_id", "user2_id", "date", 
                    "dist", "length", "is_piscine"
                    ) VALUES (
                    %(id)s, %(user1_id)s, %(user2_id)s, %(date)s, 
                    %(dist)s, %(length)s, %(is_piscine)s
                )
                ON CONFLICT DO NOTHING
                """, {
                    "id": good_id, 
                    "user1_id": sit1["user_id"],
                    "user2_id": sit2["user_id"],
                    "date": day,
                    "dist": dist,
                    "length": length,
                    "is_piscine": sit1["is_piscine"] and sit2["is_piscine"]
                })

            if sit1["is_piscine"] == False and day_peaks["total"] < len(peaks):
                day_peaks["total"] = len(peaks)

            if sit1["is_piscine"] == False and day_peaks["total_same"] < len(same_peaks):
                day_peaks["total_same"] = len(same_peaks)
                day_peaks["peak_at"] = sit1["begin_at"]



            if sit1["is_piscine"] == True and day_peaks_piscine["total"] < len(peaks):
                day_peaks_piscine["total"] = len(peaks)

            if sit1["is_piscine"] == True and day_peaks_piscine["total_same"] < len(same_peaks):
                day_peaks_piscine["total_same"] = len(same_peaks)
                day_peaks_piscine["peak_at"] = sit1["begin_at"]

        

        if (day_peaks["total"] > 0):
            executeQueryAction("""INSERT INTO vp_peaks (
                "id", "peak_at", "total", "total_same", "date", "is_piscine"
                ) VALUES (
                %(id)s, %(peak_at)s, %(total)s, %(total_same)s, %(date)s, %(is_piscine)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": f"0_{day}", 
                "peak_at": day_peaks["peak_at"],
                "total": day_peaks["total"],
                "total_same": day_peaks["total_same"],
                "date": day,
                "is_piscine": False
            })
        if (day_peaks_piscine["total"] > 0):
            executeQueryAction("""INSERT INTO vp_peaks (
                "id", "peak_at", "total", "total_same", "date", "is_piscine"
                ) VALUES (
                %(id)s, %(peak_at)s, %(total)s, %(total_same)s, %(date)s, %(is_piscine)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": f"1_{day}", 
                "peak_at": day_peaks_piscine["peak_at"],
                "total": day_peaks_piscine["total"],
                "total_same": day_peaks_piscine["total_same"],
                "date": day,
                "is_piscine": True
            })

    mylogger("End locations processor", LOGGER_ALERT)
    


if __name__ == "__main__":
    process_locations(False)