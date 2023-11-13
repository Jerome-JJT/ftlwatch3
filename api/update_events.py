


from _dbConnector import *
from _api import *
import click



# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
local_events = []
current_limit = 10
limit_checker = 10


def import_event_user(event):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    api_event_users = callapi(f"/v2/events/{event['id']}/events_users", nultiple=1)
    api_event_users_ids = list(map(lambda x: x['user']['id'], api_event_users))

    db_event_users = executeQuerySelect("SELECT id FROM team_user WHERE team_id = %(event_id)s",
    {
        "event_id": event["id"]
    })
    db_event_users_ids = list(map(lambda x: x['id'], db_event_users))


    changed = False

    for good_id in api_event_users_ids:

        try:
            db_event_users_ids.remove(good_id)
        except:
            changed = True
            pass
        mylogger(f"Import event_user {good_id}", LOGGER_INFO)


        executeQueryAction("""INSERT INTO event_user (
            "id", "event_id", "user_id"
        ) VALUES (
            %(id)s, %(event_id)s, %(user_id)s
        )
        ON CONFLICT DO NOTHING
        """, {
            "id": good_id,
            "event_id": event["id"],
            "user_id": good_id
        })

    for toremove in db_event_users_ids:
        changed = True
        mylogger(f"Remove event_user {toremove}", LOGGER_INFO)

        executeQueryAction("""DELETE FROM event_user WHERE id = %(id)s
        """, {
            "id": toremove
        })

    return changed
        




def event_callback(event):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    global local_events
    global limit_checker
    global current_limit

    mylogger(f"Import event {event['id']} {event['name']}", LOGGER_INFO)

    # print(event)
    good = {
        "id": event["id"],
        "name": event["name"],
        "description": event["description"],
        "location": event["location"],
        "kind": event["kind"],
        "max_people": event["max_people"] if event["max_people"] != None else -1,

        "has_cursus21": 21 in event["cursus_ids"],
        "has_cursus9": 9 in event["cursus_ids"],
        "begin_at": event["begin_at"],
        "end_at": event["end_at"],
        "created_at": event["created_at"],
        "updated_at": event["updated_at"],
    }


    executeQueryAction("""INSERT INTO events (
        "id", "name", "description", "location", "kind",
        "max_people", "has_cursus21", "has_cursus9", "begin_at", "end_at",
        "created_at", "updated_at"
    ) VALUES (
        %(id)s, %(name)s, %(description)s, %(location)s, %(kind)s,
        %(max_people)s, %(has_cursus21)s, %(has_cursus9)s, %(begin_at)s, %(end_at)s,
        %(created_at)s, %(updated_at)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "name" = EXCLUDED.name,
        "description" = EXCLUDED.description,
        "location" = EXCLUDED.location,
        "kind" = EXCLUDED.kind,
        "max_people" = EXCLUDED.max_people,
        "has_cursus21" = EXCLUDED.has_cursus21,
        "has_cursus9" = EXCLUDED.has_cursus9,
        "begin_at" = EXCLUDED.begin_at,
        "end_at" = EXCLUDED.end_at,
        "created_at" = EXCLUDED.created_at,
        "updated_at" = EXCLUDED.updated_at
    """, {
        "id": good["id"],
        "name": good["name"],
        "description": good["description"],
        "location": good["location"],
        "kind": good["kind"],
        "max_people": good["max_people"],
        "has_cursus21": good["has_cursus21"],
        "has_cursus9": good["has_cursus9"],
        "begin_at": good["begin_at"],
        "end_at": good["end_at"],
        "created_at": good["created_at"],
        "updated_at": good["updated_at"],
    })

    changed = False
    if (event['campus_ids'] == [47]):
        changed = import_event_user(event)

    if event["id"] not in local_events or changed == True:
        current_limit = limit_checker
    else:
        current_limit -= 1

    return (current_limit > 0)


@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1, help="start at")

def import_events(update_all=False, start_at=1):
    global local_events

    local_events = executeQuerySelect("SELECT id FROM events ORDER BY id DESC LIMIT 1000")
    local_events = [one['id'] for one in local_events] 

    if (len(local_events) == 0):
        update_all = True

    if (update_all):
        callapi("/v2/campus/47/events?sort=id", nultiple=start_at, callback=event_callback, callback_limit=False)
    else:
        callapi(f"/v2/campus/47/events?sort=-id", nultiple=1, callback=event_callback, callback_limit=True)


if __name__ == "__main__":
    import_events()