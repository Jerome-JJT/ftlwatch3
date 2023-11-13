


from _dbConnector import *
from _api import *
import click



# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
local_teams = []
current_limit = 300
limit_checker = 300


def import_team_user(team):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    team_users = executeQuerySelect("SELECT id FROM team_user WHERE team_id = %(team_id)s",
    {
        "team_id": team["id"]
    })
    team_users = [one["id"] for one in team_users]

    for user in team["users"]:
        good_id = f"""{team["id"]}_{user["id"]}"""
        try:
            team_users.remove(good_id)
        except:
            pass
        mylogger(f"Import team_user {good_id} {user['login']}", LOGGER_INFO)


        executeQueryAction("""INSERT INTO team_user (
            "id", "team_id", "user_id", "is_leader"
        ) VALUES (
            %(id)s, %(team_id)s, %(user_id)s, %(is_leader)s
        )
        ON CONFLICT DO NOTHING
        """, {
            "id": good_id,
            "team_id": team["id"],
            "user_id": user["id"],
            "is_leader": user["leader"]
        })

    for toremove in team_users:
        mylogger(f"Remove team_user {toremove}", LOGGER_INFO)

        executeQueryAction("""DELETE FROM team_user WHERE id = %(id)s
        """, {
            "id": toremove
        })



def import_team_scale(team):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    for scale in team["scale_teams"]:
        mylogger(f"Import team_scale {scale['id']}", LOGGER_INFO)

        executeQueryAction("""INSERT INTO team_scale (
            "id", "team_id", "comment", "feedback", "final_mark",
            "begin_at", "filled_at", "corrector_id", "created_at", "updated_at"
        ) VALUES (
            %(id)s, %(team_id)s, %(comment)s, %(feedback)s, %(final_mark)s,
            %(begin_at)s, %(filled_at)s, %(corrector_id)s, %(created_at)s, %(updated_at)s
        )
        ON CONFLICT (id)
        DO UPDATE SET
            "comment" = EXCLUDED.comment,
            "feedback" = EXCLUDED.feedback,
            "final_mark" = EXCLUDED.final_mark,
            "begin_at" = EXCLUDED.begin_at,
            "filled_at" = EXCLUDED.filled_at,
            "corrector_id" = EXCLUDED.corrector_id,
            "updated_at" = EXCLUDED.updated_at
        """, {
            "id": scale["id"],
            "team_id": team["id"],
            "comment": scale["comment"],
            "feedback": scale["feedback"],
            "final_mark": scale["final_mark"],
            "begin_at": scale["begin_at"],
            "filled_at": scale["filled_at"],
            "corrector_id": scale["corrector"]["id"] if (scale["corrector"] != 'invisible') else None,
            "created_at": scale["created_at"],
            "updated_at": scale["updated_at"]
        })


def team_callback(team):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    global local_teams
    global limit_checker
    global current_limit

    mylogger(f"Import team {team['id']} {team['name']}", LOGGER_INFO)

    team_user_ids = list(map(lambda x: x['id'], team['users']))
    team_user_ids.sort()
    team_user_ids = list(map(lambda x: str(x), team_user_ids))
    good_retry_common = f"{team['project_id']}_{'_'.join(team_user_ids)}"

    executeQueryAction("""INSERT INTO teams (
        "id", "name", "final_mark", "project_id", "retry_common", "status", 
        "is_locked", "is_validated", "is_closed",
        "created_at", "updated_at"
        
        ) VALUES (

        %(id)s, %(name)s, %(final_mark)s, %(project_id)s, %(retry_common)s, %(status)s, 
        %(is_locked)s, %(is_validated)s, %(is_closed)s, 
        %(created_at)s, %(updated_at)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        final_mark = EXCLUDED.final_mark,
        project_id = EXCLUDED.project_id,
        retry_common = EXCLUDED.retry_common,
        status = EXCLUDED.status,
        is_validated = EXCLUDED.is_validated,
        is_closed = EXCLUDED.is_closed,
        updated_at = EXCLUDED.updated_at
    """, {
        "id": team["id"], 
        "name": team["name"],
        "final_mark": team["final_mark"],
        "project_id": team["project_id"],
        "retry_common": good_retry_common,
        "status": team["status"],

        "is_locked": team["locked?"],
        "is_validated": team["validated?"],
        "is_closed": team["closed?"],

        "created_at": team["created_at"],
        "updated_at": team["updated_at"],
    })

    import_team_user(team)
    import_team_scale(team)

    if team["id"] not in local_teams:
        current_limit = limit_checker
    else:
        current_limit -= 1

    return (current_limit > 0)


@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1, help="start at")

def import_teams(update_all=False, start_at=1):
    global local_teams

    local_teams = executeQuerySelect("SELECT id FROM teams ORDER BY id DESC LIMIT 1000")
    local_teams = [one['id'] for one in local_teams] 

    if (len(local_teams) == 0):
        update_all = True

    if (update_all):
        callapi("/v2/teams?filter[primary_campus]=47&sort=id", nultiple=start_at, callback=team_callback, callback_limit=False)
    else:
        callapi(f"/v2/teams?filter[primary_campus]=47&sort=-updated_at", nultiple=1, callback=team_callback, callback_limit=True)


if __name__ == "__main__":
    import_teams()