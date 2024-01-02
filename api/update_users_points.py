


from _dbConnector import *
from _api import *
import click
from dateutil import parser
import pytz

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

local_teams = []
current_limit = 50
limit_checker = 50



def user_points_notification(fetched):
    from _utils_discord import discord_diff
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM points_transactions WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://profile.intra.42.ch/users/{fetched["login"]}/correction_point_historics',
        'description': f'https://42lwatch.ch/basics/points',
        'footer_text': parser.parse(fetched["updated_at"]).astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }

    if (len(refer) == 0):
        embed['title'] = f'Created transaction for {fetched["login"]}'
        refer = None
    else:
        embed['title'] = f'Updated transaction for {fetched["login"]}'
        refer = refer[0]


    check_fields = ["reason", "sum", "total"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or str(refer[check]) != str(fetched[check])):
            diffs[check] = discord_diff(refer, fetched, check)

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified transaction {fetched['id']} {fetched['login']}", LOGGER_INFO)
        send_to_rabbit('points.server.message.queue', embed)



def user_points_callback(transac, user):
    global local_points, current_limit, limit_checker
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    if (transac['id'] not in local_points):
        current_limit = limit_checker


        mylogger(f"Import point for {user['id']} {user['login']}, {transac['sum']} {transac['reason']} / current_limit = {current_limit}", LOGGER_INFO)

        transac['is_piscine'] = True
        if user['pool_year'] != None:
            year = str(user['pool_year'])

            if (len(year) > 0):
                piscine_concern = f"{year if year else '2000'}-10-01"
                transac['is_piscine'] = transac['created_at'] < piscine_concern


        transac['is_local'] = False
        campus47 = next(filter(lambda x: x['is_primary'] == True and x['campus_id'] == 47, user["campus_users"]), None)
        if (campus47 != None):
            transac['is_local'] = transac['created_at'] > campus47['created_at']

    
        good = {
            "id": transac['id'],
            "user_id": user['id'],
            "reason": transac['reason'],
            "sum": transac['sum'],
            "total": transac['total'],
            "scale_team_id": transac['scale_team_id'],
            "is_piscine": transac['is_piscine'],
            "is_local": transac['is_local'],
            "created_at": transac['created_at'],
            "updated_at": transac['updated_at'],
        }

        std_transac = ["Defense plannification", "Refund during sales", 
                        "Earning after defense", "Creation"]
        if (good["reason"] not in std_transac):
            user_points_notification({**good, "login": user['login']})

        executeQueryAction("""INSERT INTO points_transactions (
                "id", "user_id", "reason", "sum", "total", "scale_team_id", "is_piscine", "is_local", "created_at", "updated_at"
            ) VALUES (
                %(id)s, %(user_id)s, %(reason)s, %(sum)s, %(total)s, %(scale_team_id)s, %(is_piscine)s, %(is_local)s, %(created_at)s, %(updated_at)s
            )
            ON CONFLICT (id)
            DO UPDATE SET
            "user_id" = EXCLUDED.user_id,
            "reason" = EXCLUDED.reason,
            "sum" = EXCLUDED.sum,
            "total" = EXCLUDED.total,
            "scale_team_id" = EXCLUDED.scale_team_id,
            "is_piscine" = EXCLUDED.is_piscine,
            "is_local" = EXCLUDED.is_local,
            "created_at" = EXCLUDED.created_at,
            "updated_at" = EXCLUDED.updated_at
            """, good)


    else:
        current_limit -= 1

    return (current_limit > 0)


def import_users_points(update_all=False, start_at=1):
    global local_points
    global current_limit, limit_checker
    from _utils_mylogger import mylogger, LOGGER_ALERT

    current_limit = 50
    limit_checker = 50

    to_check = executeQuerySelect("""SELECT id, login FROM users WHERE kind = 'student' ORDER BY id""")

    mylogger("Start users points worker", LOGGER_ALERT)

    print(len(to_check))
    for check in to_check[start_at-1:]:

        user = callapi(f"/v2/users/{check['login']}", nultiple=0)
        time.sleep(0.4)
        if (user == []):
            continue

        local_points = executeQuerySelect("SELECT id FROM points_transactions WHERE user_id = %(user_id)s ORDER BY id DESC LIMIT 1000", {
            "user_id": check['id']
        })
        local_points = [one['id'] for one in local_points] 

        if (len(local_points) == 0):
            update_all = True

        if (update_all):
            callapi(f"/v2/users/{user['id']}/correction_point_historics?sort=id", nultiple=1, callback=lambda transac: user_points_callback(transac, user), callback_limit=False)

        else:
            callapi(f"/v2/users/{user['id']}/correction_point_historics?sort=-id", nultiple=1, callback=lambda transac: user_points_callback(transac, user), callback_limit=True)

        time.sleep(0.4)

    mylogger("End users points worker", LOGGER_ALERT)


@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1, help="start at")

def starter(update_all=False, start_at=1):
    import_users_points(update_all, start_at)

if __name__ == "__main__":
    starter()