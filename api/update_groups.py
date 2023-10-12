


from _utils import *
from _dbConnector import *
from _api import *


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def group_callback(group):

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





import_groups()