


from _utils import *
from _dbConnector import *
from _api import *


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def title_callback(title):

    mylogger(f"Import title {title['id']} {title['name']}", LOGGER_INFO)

    executeQueryAction("""INSERT INTO titles (
        "id", "name"
    ) VALUES (
        %(id)s, %(name)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name
    """, {
        "id": title["id"],
        "name": title["name"]
    })

    return True

def import_titles():

    callapi("/v2/titles?sort=id", True, title_callback, False)


if __name__ == "__main__":
    import_titles()