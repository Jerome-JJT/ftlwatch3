


from _utils import *
from _dbConnector import *
from _api import *
# from dateutil.parser import parse
from dateutil import parser
import datetime
from _hosts import host_locations


local_locations = []

current_limit = 300
limit_checker = 300


def process_locations(update_all = False):
    global local_locations

    days_done = []
    if (update_all == False):
            days_done = executeQuerySelect("select DISTINCT date from vp_loves")
            days_done = [one["date"] for one in days_done] 

    days = executeQuerySelect("select DISTINCT date from locations")
    days = [one["date"] for one in filter(lambda d: d["date"] not in days_done, days)] 

    all_hosts = host_locations()

    # days = ['2021-07-04']

    for day in days:
        locates = executeQuerySelect("select id, begin_at, end_at, is_piscine, host, user_id from locations WHERE date = %(date)s", {
            "date": day
        })

        day_peaks = None
        day_peaks_piscine = None
        
        for i, sit1 in enumerate(locates):

            if (sit1["host"] not in all_hosts.keys()):
                continue

            print(day, f"{i}/{len(locates)}")
            
            peaks = [sit1["user_id"]]

            for sit2 in locates:
                if (sit2["id"] <= sit1["id"]):
                    continue

                if (sit2["host"] not in all_hosts.keys()):
                    continue

                if (sit2["user_id"] not in peaks and sit1["is_piscine"] == sit2["is_piscine"]):
                    peaks.append(sit2["user_id"])

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
                    "is_piscine": sit1["is_piscine"] or sit2["is_piscine"]
                })

            if sit1["is_piscine"] == False and (day_peaks == None or day_peaks["number"] < len(peaks)):
                day_peaks = {"number": len(peaks), "begin_at": sit1["begin_at"]}

            if sit1["is_piscine"] == True and (day_peaks_piscine == None or day_peaks_piscine["number"] < len(peaks)):
                day_peaks_piscine = {"number": len(peaks), "begin_at": sit1["begin_at"]}

        

        if (day_peaks != None):
            executeQueryAction("""INSERT INTO vp_peaks (
                "id", "begin_at", "ccount", "date", "is_piscine"
                ) VALUES (
                %(id)s, %(begin_at)s, %(ccount)s, %(date)s, %(is_piscine)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": f"0_{day}", 
                "begin_at": day_peaks["begin_at"],
                "ccount": day_peaks["number"],
                "date": day,
                "is_piscine": False
            })
        elif(day_peaks_piscine != None):
            executeQueryAction("""INSERT INTO vp_peaks (
                "id", "begin_at", "ccount", "date", "is_piscine"
                ) VALUES (
                %(id)s, %(begin_at)s, %(ccount)s, %(date)s, %(is_piscine)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": f"1_{day}", 
                "begin_at": day_peaks_piscine["begin_at"],
                "ccount": day_peaks_piscine["number"],
                "date": day,
                "is_piscine": True
            })


if __name__ == "__main__":
    process_locations(False)