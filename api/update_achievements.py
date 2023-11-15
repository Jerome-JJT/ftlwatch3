


from _dbConnector import *
from _api import *


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def achievement_callback(achievement):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import achievement {achievement['id']} {achievement['name']}", LOGGER_INFO)

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
    """, {
        "id": achievement["id"],
        "name": achievement["name"],
        "description": achievement["description"],
        "kind": achievement["kind"],
        "image": achievement["image"],
        "has_lausanne": "Lausanne" in achievement["campus"],
        "title_id": achievement["title"]["id"] if achievement["title"] != None else None
    })


    return True

def import_achievements():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start achievements worker", LOGGER_ALERT)
    callapi("/v2/achievements?sort=id", True, achievement_callback, False)
    mylogger("End achievements worker", LOGGER_ALERT)





if __name__ == "__main__":
    import_achievements()