


from _dbConnector import *
from _api import *
import datetime
from dateutil import parser



poolfilters = []

def import_title_user(user):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    titles_user = executeQuerySelect("SELECT id FROM titles_users WHERE user_id = %(user_id)s",
    {
        "user_id": user["id"]
    })
    titles_user = [one["id"] for one in titles_user]

    for title in user["titles_users"]:
        
        try:
            titles_user.remove(title["id"])
        except:
            pass

        mylogger(f"Import titles_user {title['title_id']} {user['login']}", LOGGER_INFO)


        executeQueryAction("""INSERT INTO titles_users (
            "id", "title_id", "user_id"
        ) VALUES (
            %(id)s, %(title_id)s, %(user_id)s
        )
        ON CONFLICT DO NOTHING
        """, {
            "id": title["id"],
            "title_id": title["title_id"],
            "user_id": user["id"],
        })

    for toremove in titles_user:
        mylogger(f"Remove titles_user {toremove}", LOGGER_INFO)

        executeQueryAction("""DELETE FROM titles_users WHERE id = %(id)s
        """, {
            "id": toremove
        })



def timed_user_log(days, correction_point, wallet, level, date, user_id):

    executeQueryAction("""INSERT INTO timedusers (
        "days", "correction_point", "wallet", "level",
        "date", "user_id"
    ) VALUES (
        %(days)s, %(correction_point)s, %(wallet)s, %(level)s, %(date)s, %(user_id)s
    )
    ON CONFLICT (date, user_id) DO NOTHING
    """, {
        "days": days,
        "correction_point": correction_point,
        "wallet": wallet,
        "level": level,
        "date": date,
        "user_id": user_id
    })



def user_full_import(user_id, good_firstname, good_displayname, good_avatar_url, good_poolfilter_id):

    full_user = callapi(f"/v2/users/{user_id}", False)

    good_nbcursus = len(full_user["cursus_users"])
    good_has_cursus21 = len(list(filter(lambda x: x["cursus_id"] == 21, full_user["cursus_users"]))) > 0
    good_has_cursus9 = len(list(filter(lambda x: x["cursus_id"] == 9, full_user["cursus_users"]))) > 0

    tmp_cursus21 = list(filter(lambda x: x["cursus_id"] == 21, full_user["cursus_users"]))
    good_cursus = tmp_cursus21[0] if len(tmp_cursus21) > 0 else None

    good_blackhole = good_cursus["blackholed_at"] if good_cursus != None else None
    good_level = good_cursus["level"] if good_cursus != None else None
    good_grade = good_cursus["grade"] if good_cursus != None else None

    good_is_bde = len(list(filter(lambda x: x["name"] == "BDE", full_user["groups"]))) > 0
    good_is_tutor = len(list(filter(lambda x: x["name"] == "TUTOR", full_user["groups"]))) > 0

        
    executeQueryAction("""INSERT INTO users (
        "id", "login", "first_name", "last_name", "display_name", "avatar_url",
        "kind", "is_staff", "is_active", "is_alumni", "wallet", "correction_point", "nbcursus", "has_cursus21", "has_cursus9",
        "cursus21_coalition_id", "cursus9_coalition_id", "blackhole", "grade", "level",
        "is_bde", "is_tutor", "poolfilter_id", "hidden", "created_at", "updated_at"
    ) VALUES (
        %(id)s, %(login)s, %(first_name)s, %(last_name)s, %(display_name)s, %(avatar_url)s,
        %(kind)s, %(is_staff)s, %(is_active)s, %(is_alumni)s, %(wallet)s, %(correction_point)s, %(nbcursus)s, %(has_cursus21)s, %(has_cursus9)s,
        %(cursus21_coalition_id)s, %(cursus9_coalition_id)s, %(blackhole)s, %(grade)s, %(level)s,
        %(is_bde)s, %(is_tutor)s, %(poolfilter_id)s, %(hidden)s, %(created_at)s, %(updated_at)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        "login" = EXCLUDED.login,
        "first_name" = EXCLUDED.first_name,
        "last_name" = EXCLUDED.last_name,
        "display_name" = EXCLUDED.display_name,
        "avatar_url" = EXCLUDED.avatar_url,

        "kind" = EXCLUDED.kind,
        "is_staff" = EXCLUDED.is_staff,
        "is_active" = EXCLUDED.is_active,
        "is_alumni" = EXCLUDED.is_alumni,
        "wallet" = EXCLUDED.wallet,
        "correction_point" = EXCLUDED.correction_point,

        "nbcursus" = EXCLUDED.nbcursus,
        "has_cursus21" = EXCLUDED.has_cursus21,
        "has_cursus9" = EXCLUDED.has_cursus9,

        "blackhole" = EXCLUDED.blackhole,

        "grade" = EXCLUDED.grade,
        "level" = EXCLUDED.level,
        "is_bde" = EXCLUDED.is_bde,
        "is_tutor" = EXCLUDED.is_tutor,

        "poolfilter_id" = EXCLUDED.poolfilter_id,
        "created_at" = EXCLUDED.created_at,
        "updated_at" = EXCLUDED.updated_at
    """, {
        "id": full_user["id"],
        "login": full_user["login"],
        "first_name": good_firstname,
        "last_name": full_user["last_name"],
        "display_name": good_displayname,
        "avatar_url": good_avatar_url,

        "kind": full_user["kind"],
        "is_staff": full_user["staff?"],
        "is_active": full_user["active?"],
        "is_alumni": full_user["alumni?"],
        "wallet": full_user["wallet"],
        "correction_point": full_user["correction_point"],

        "nbcursus": good_nbcursus,
        "has_cursus21": good_has_cursus21,
        "has_cursus9": good_has_cursus9,

        "cursus21_coalition_id": None,
        "cursus9_coalition_id": None,

        "blackhole": good_blackhole,

        "grade": good_grade,
        "level": good_level,
        "is_bde": good_is_bde,
        "is_tutor": good_is_tutor,

        "poolfilter_id": good_poolfilter_id,

        "hidden": False,
        "created_at": full_user["created_at"],
        "updated_at": full_user["updated_at"],
    })


    good_days = (parser.parse(good_blackhole).replace(tzinfo=None) - datetime.datetime.now().replace(tzinfo=None)).days if good_blackhole != None else -1
    
    import_title_user(full_user)
    timed_user_log(good_days, full_user["correction_point"], full_user["wallet"], 
                good_level, datetime.datetime.now().strftime("%Y-%m-%d"), full_user["id"])



def user_callback(user, cursus21_ids, local_users):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    global poolfilters

    mylogger(f"Import user {user['id']} {user['login']}", LOGGER_INFO)

    good_firstname = user["usual_first_name"] if user.get("usual_first_name") else user["first_name"]
    good_displayname = user["usual_full_name"] if user.get("usual_full_name") else user["displayname"]

    good_avatar_url = ""
    if (user.get("image") and user["image"].get("versions") and user["image"]["versions"].get("medium")):
        good_avatar_url = user["image"]["versions"]["medium"]

    if (good_avatar_url == "" and user.get("image") and user["image"].get("link")):
        good_avatar_url = user["image"]["link"]

    good_poolfilter = f"""{user["pool_year"]}.{user["pool_month"]}"""


    if (len(list(filter(lambda gfilter: gfilter["name"] == good_poolfilter, poolfilters))) == 0):

        executeQueryAction("""INSERT INTO poolfilters ("name") VALUES (%(name)s)""", {
            "name": good_poolfilter
        })
        poolfilters = executeQuerySelect("SELECT id, name FROM poolfilters")

    good_poolfilter_id = list(filter(lambda gfilter: gfilter["name"] == good_poolfilter, poolfilters))[0]["id"]


    #Full import
    if (user["id"] not in local_users or user["id"] in cursus21_ids):
        user_full_import(user["id"], good_firstname, good_displayname, good_avatar_url, good_poolfilter_id)
        
    else:

        executeQueryAction("""UPDATE users SET
            "login" = %(login)s,
            "first_name" = %(first_name)s,
            "last_name" = %(last_name)s,
            "display_name" = %(display_name)s,
            "avatar_url" = %(avatar_url)s,

            "kind" = %(kind)s,
            "is_staff" = %(is_staff)s,
            "is_active" = %(is_active)s,
            "is_alumni" = %(is_alumni)s,
            "wallet" = %(wallet)s,
            "correction_point" = %(correction_point)s,

            "created_at" = %(created_at)s,
            "updated_at" = %(updated_at)s

            WHERE id = %(id)s
        """, {
            "id": user["id"],
            "login": user["login"],
            "first_name": good_firstname,
            "last_name": user["last_name"],
            "display_name": good_displayname,
            "avatar_url": good_avatar_url,

            "kind": user["kind"],
            "is_staff": user["staff?"],
            "is_active": user["active?"],
            "is_alumni": user["alumni?"],
            "wallet": user["wallet"],
            "correction_point": user["correction_point"],

            "created_at": user["created_at"],
            "updated_at": user["updated_at"],
        })

        timed_user_log(-1, user["correction_point"], user["wallet"], -1, datetime.datetime.now().strftime("%Y-%m-%d"), user["id"])

    return True


def import_users():
    global poolfilters

    local_users = executeQuerySelect("SELECT id FROM users")
    # local_users = {user["id"]: user for user in local_users} 
    local_users = [user["id"] for user in local_users] 

    all_users = callapi("/v2/campus/47/users?sort=id", True)
    cursus_users = callapi("/v2/cursus/21/cursus_users?filter[campus_id]=47", True)
    # cursus_users = {user["user"]["id"]: user for user in cursus_users} 
    cursus21_ids = [user["user"]["id"] for user in cursus_users]


    poolfilters = executeQuerySelect("SELECT id, name FROM poolfilters")


    for user in all_users:
        user_callback(user, cursus21_ids, local_users)


if __name__ == "__main__":
    import_users()