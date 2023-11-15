


from _dbConnector import *
from _api import *


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def cursus_callback(cursus):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import cursus {cursus['id']} {cursus['name']}", LOGGER_INFO)

    executeQueryAction("""INSERT INTO cursus (
        "id", "name", "slug", "kind"
    ) VALUES (
        %(id)s, %(name)s, %(slug)s, %(kind)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name,
        "slug" = EXCLUDED.slug,
        "kind" = EXCLUDED.kind
    """, {
        "id": cursus["id"],
        "name": cursus["name"],
        "slug": cursus["slug"],
        "kind": cursus["kind"]
    })

    return True

def import_cursus():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start cursus worker", LOGGER_ALERT)
    callapi("/v2/cursus?sort=id", True, cursus_callback, False)
    mylogger("End cursus worker", LOGGER_ALERT)


if __name__ == "__main__":
    import_cursus()