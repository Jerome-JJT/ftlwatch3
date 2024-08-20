


from _dbConnector import *
from _api import *
# from dateutil.parser import parse
import math
from _hosts import host_locations



def process_eval_cost(update_all = False):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR, LOGGER_ALERT

    mylogger("Start eval cost processor", LOGGER_ALERT)

    
    raw_known = executeQuerySelect("SELECT DISTINCT scale_id, cost FROM team_scale WHERE cost IS NOT NULL AND scale_id IS NOT NULL")
    costs_known = {rknown["scale_id"]: rknown["cost"] for rknown in raw_known}

    raw_unknown = executeQuerySelect("SELECT MIN(id) AS test_team_id, scale_id FROM team_scale WHERE cost IS NULL GROUP BY scale_id ORDER BY scale_id")
    costs_unknown = {runknown["scale_id"]: runknown["test_team_id"] for runknown in raw_unknown}


    for scale_id in costs_unknown.keys():

        if (scale_id in costs_known.keys()):
            mylogger(f"Process known {scale_id}", LOGGER_INFO)
                

            executeQueryAction("""UPDATE team_scale 
                                SET "cost" = %(cost)s 
                                WHERE scale_id = %(scale_id)s""", {
                                    "cost": costs_known[scale_id],
                                    "scale_id": scale_id
                                })
                
        else:
            mylogger(f"Process unknown {scale_id}", LOGGER_INFO)

            value = None
            try:
                scale_team = callapi(f"/v2/scale_teams/{costs_unknown[scale_id]}")
                time.sleep(0.6)
                value = max(1, math.floor(scale_team["scale"]["duration"] / 1800))
            except Exception as e:
                mylogger(f"No duration for {scale_id}", LOGGER_ERROR) 
                continue

            executeQueryAction("""UPDATE team_scale 
                                SET "cost" = %(cost)s 
                                WHERE scale_id = %(scale_id)s""", {
                                    "cost": value,
                                    "scale_id": scale_id
                                })
            


    mylogger("End eval cost processor", LOGGER_ALERT)
    


if __name__ == "__main__":
    process_eval_cost()