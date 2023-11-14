


from _dbConnector import *
from _api import *


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def campus_callback(campus):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import campus {campus['id']} {campus['name']}", LOGGER_INFO)

    executeQueryAction("""INSERT INTO campus (
        "id", "name", "timezone", 
        "country", "city", "address", "website", "users_count"
    ) VALUES (
        %(id)s, %(name)s, %(timezone)s, 
        %(country)s, %(city)s, %(address)s, %(website)s, %(users_count)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name,
        "timezone" = EXCLUDED.timezone,
        "country" = EXCLUDED.country,
        "city" = EXCLUDED.city,
        "address" = EXCLUDED.address,
        "website" = EXCLUDED.website,
        "users_count" = EXCLUDED.users_count
    """, {
        "id": campus["id"],
        "name": campus["name"],
        "timezone": campus["time_zone"],
        "country": campus["country"],
        "city": campus["city"],
        "address": campus["address"],
        "website": campus["website"],
        "users_count": campus["users_count"]
    })


    return True

def import_campus():
    callapi("/v2/campus?sort=id", True, campus_callback, False)




if __name__ == "__main__":
    import_campus()