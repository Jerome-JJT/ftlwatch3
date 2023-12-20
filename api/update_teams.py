


from _dbConnector import *
from _api import *
import click
import time
from dateutil import parser
import pytz


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
local_teams = []
current_limit = 300
limit_checker = 300



def team_notification(fetched):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    mandatory_fields = ["name", "final_mark", "status", "_users"]
    check_fields = ["name", "final_mark", "project_id", "retry_common", "status", "is_locked", "is_validated", "is_closed"]

    refer = executeQuerySelect("SELECT * FROM teams WHERE id = %(id)s", {
        "id": fetched["id"]
    })
    refer_team_users = executeQuerySelect("""SELECT users.login FROM team_user 
                                          LEFT JOIN users ON users.id = team_user.user_id WHERE team_id = %(team_id)s""",
    {
        "team_id": fetched["id"]
    })

    project = executeQuerySelect("SELECT slug FROM projects WHERE id = %(id)s", {
        "id": fetched["project_id"]
    })
    if (len(project) > 0):
        project = project[0]["slug"]
    else:
        project = ""

    leader = list(filter(lambda x: x["leader"], fetched["users"]))
    if len(leader) > 0:
        leader = leader[0]
        leader_refer = executeQuerySelect("SELECT display_name, login, avatar_url FROM users WHERE id = %(id)s", {
            "id": leader["id"]
        })

        if (len(leader_refer) > 0):
            leader_refer = leader_refer[0]
            leader["avatar_url"] = leader_refer["avatar_url"]
        else:
            leader["avatar_url"] = None

    else:
        leader = {"login": "empty", "avatar_url": None, "projects_user_id": 0}



    embed = {
        'message_type': 'embed',
        'url': f'https://projects.intra.42.fr/projects/{fetched["project_id"]}/projects_users/{leader["projects_user_id"]}',
        'footer_text': parser.parse(fetched["updated_at"]).astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }
    if leader["avatar_url"] != None:
        embed["thumbnail"] = f'{leader["avatar_url"]}'

    if (len(refer) == 0):
        embed['title'] = f'Created team for {leader["login"]}, on {project}'
        refer = None
    else:
        embed['title'] = f'Updated team for {leader["login"]}, on {project}'
        refer = refer[0]

    if (refer):
        refer["_users"] = ", ".join(sorted(list(map(lambda x: x["login"], refer_team_users))))
    fetched["_users"] = ", ".join(sorted(list(map(lambda x: x["login"], fetched["users"]))))
    check_fields.append("_users")

    
    diffs = {}
    diff_flag = False

    for check in check_fields:
        if (refer == None or refer[check] != fetched[check]):
            diff_flag = True
            diffs[check] = f'ref: `{refer[check] if refer != None else " "}`, new: `{fetched[check]}`'
        elif (check in mandatory_fields):
            diffs[check] = f'`{fetched[check]}`'

    fetched["scale_teams"].sort(key=lambda x: x['id'])
    for num, scale in enumerate(fetched["scale_teams"]):

        if (scale["comment"] != None or scale["feedback"] != None):

            refer_scale = executeQuerySelect("SELECT id, comment, feedback FROM team_scale WHERE id = %(id)s", {
                "id": scale["id"]
            })

            if (len(refer_scale) > 0):
                refer_scale = refer_scale[0]
            else:
                refer_scale = None

            if (scale["comment"] != None and (refer_scale == None or refer_scale['comment'] == None)):
                diff_flag = True
                diffs[f'comment_{num+1}'] = f'Comment: ```{scale["comment"]}```'
                diffs[f'final_mark_{num+1}'] = f'Mark: `{scale["final_mark"]}`'
                diffs[f'corrector_{num+1}'] = f'Corrector `{scale["corrector"]["login"] if (scale["corrector"] != "invisible") else "None"}`'

            if (scale["feedback"] != None and (refer_scale == None or refer_scale['feedback'] == None)):
                diff_flag = True
                diffs[f'feedback_{num+1}'] = f'Comment: ```{scale["feedback"]}```'
                diffs[f'final_mark_{num+1}'] = f'Mark: `{scale["final_mark"]}`'
                diffs[f'corrector_{num+1}'] = f'Corrector `{scale["corrector"]["login"] if (scale["corrector"] != "invisible") else "None"}`'


    if (diff_flag):
        embed['fields'] = diffs

        mylogger(f"Nofified team {fetched['id']} {fetched['name']}", LOGGER_INFO)
        send_to_rabbit('teams.server.message.queue', embed)



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
            "id", "team_id", "user_id", "is_leader", "projects_user_id"
        ) VALUES (
            %(id)s, %(team_id)s, %(user_id)s, %(is_leader)s, %(projects_user_id)s
        )
        ON CONFLICT DO NOTHING
        """, {
            "id": good_id,
            "team_id": team["id"],
            "user_id": user["id"],
            "is_leader": user["leader"],
            "projects_user_id": user["projects_user_id"]
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

        good = {
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
        }

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
        """, good)


def team_callback(team):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    global local_teams
    global limit_checker
    global current_limit

    mylogger(f"Import team {team['id']} {team['name']} / current_limit = {current_limit}", LOGGER_INFO)

    team_user_ids = list(map(lambda x: x['id'], team['users']))
    team_user_ids.sort()
    team_user_ids = list(map(lambda x: str(x), team_user_ids))
    good_retry_common = f"{team['project_id']}_{'_'.join(team_user_ids)}"


    good = {
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
    }

    team_notification({**good, "users": team["users"], "scale_teams": team["scale_teams"]})


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
        is_locked = EXCLUDED.is_locked,
        is_validated = EXCLUDED.is_validated,
        is_closed = EXCLUDED.is_closed,
        updated_at = EXCLUDED.updated_at
    """, good)

    import_team_user(team)
    import_team_scale(team)

    if team["id"] not in local_teams:
        current_limit = limit_checker
    else:
        current_limit -= 1

    return (current_limit > 0)



def import_teams(update_all=False, start_at=1):
    global local_teams
    from _utils_mylogger import mylogger, LOGGER_ALERT

    local_teams = executeQuerySelect("SELECT id FROM teams ORDER BY id DESC")
    local_teams = [one['id'] for one in local_teams] 

    if (len(local_teams) == 0):
        update_all = True

    if (update_all):
        mylogger("Start teams full worker", LOGGER_ALERT)
        callapi("/v2/teams?filter[campus]=47&sort=id", nultiple=start_at, callback=team_callback, callback_limit=False)
        mylogger("End teams full worker", LOGGER_ALERT)

    else:
        callapi(f"/v2/teams?filter[campus]=47&sort=-updated_at", nultiple=1, callback=team_callback, callback_limit=True)


@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1, help="start at")

def starter(update_all=False, start_at=1):
    import_teams(update_all, start_at)


if __name__ == "__main__":
    starter()