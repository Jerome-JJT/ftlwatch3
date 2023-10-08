


from _utils import *
from _dbConnector import *
from _api import *



# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])



def import_projects(team):
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


        executeQueryAction("""DELETE FROM team_user WHERE
            id = %(id)s
        )
        """, {
            "id": team["id"]
        })



def import_team_scale(team):
    for scale in team["scale_teams"]:
        try:
            team_users.remove(scale["id"])
        except:
            pass
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



def import_projects(update_all = False):


    local_titles = executeQuerySelect("SELECT id FROM projects")
    local_titles = {title["id"]: title for title in local_titles} 

    if (len(local_titles) == 0):
        update_all = True

    teams = []

    if (update_all):
        teams = callapi("/v2/teams?sort=id", True)
    else:
        teams = callapi(f"/v2/teams?sort=-updated_at", False)


    for team in teams:

        mylogger(f"Import team {team['id']} {team['name']}", LOGGER_INFO)

        executeQueryAction("""INSERT INTO teams (
            "id", "name", "final_mark", "project_id", "status", 
            "is_locked", "is_validated", "is_closed",
            "created_at", "updated_at"
            
            ) VALUES (

            %(id)s, %(name)s, %(final_mark)s, %(project_id)s, %(status)s, 
            %(is_locked)s, %(is_validated)s, %(is_closed)s, 
            %(created_at)s, %(updated_at)s
        )
        ON CONFLICT (id)
        DO UPDATE SET
            final_mark = EXCLUDED.final_mark,
            status = EXCLUDED.status,
            is_locked = EXCLUDED.is_locked,
            is_validated = EXCLUDED.is_validated,
            is_closed = EXCLUDED.is_closed,
            updated_at = EXCLUDED.updated_at
        """, {
            "id": team["id"], 
            "name": team["name"],
            "final_mark": team["final_mark"],
            "project_id": team["project_id"],
            "status": team["status"],

            "is_locked": team["locked?"],
            "is_validated": team["validated?"],
            "is_closed": team["closed?"],

            "created_at": team["created_at"],
            "updated_at": team["updated_at"],
        })

        import_team_user(team)
        import_team_scale(team)

            


import_teams(True)