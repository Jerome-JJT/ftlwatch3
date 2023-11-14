


from _dbConnector import *
from _api import *


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def group_callback(group):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import group {group['id']} {group['name']}", LOGGER_INFO)

    executeQueryAction("""INSERT INTO groups (
        "id", "name"
    ) VALUES (
        %(id)s, %(name)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name
    """, {
        "id": group["id"],
        "name": group["name"]
    })

    return True

def import_groups():
    callapi("/v2/groups?sort=id", True, group_callback, False)




if __name__ == "__main__":
    import_groups()