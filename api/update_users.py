


from _utils import *
from _dbConnector import *
from _api import *


poolfilters = []


def user_callback(user):
    global poolfilters

    mylogger(f"Import product {product['id']} {product['name']}", LOGGER_INFO)

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
        poolfilters = executeQuerySelect("SELECT name FROM poolfilters")

    good_poolfilter_id = list(filter(lambda gfilter: gfilter["name"] == good_poolfilter, poolfilters))[0]["id"]

    #Full
    if (user["id"] not in local_users.keys() or user["id"] in cursus21_ids):

        
        full_user = callapi(f"/v2/users/{user['id']}", False)

            

        executeQueryAction("""INSERT INTO users (
            "id", "login", "first_name", "last_name", "display_name", "avatar_url",
            "grade", "level", "kind", "is_staff",
            "nbcursus", "has_cursus21", "has_cursus9",
            "poolfilter_id", "hidden", "created_at", "updated_at"
        ) VALUES (
            %(id)s, %(login)s, %(first_name)s, %(last_name)s, %(display_name)s, %(avatar_url)s,
            %(grade)s, %(level)s, %(kind)s, %(is_staff)s,
            %(nbcursus)s, %(has_cursus21)s, %(has_cursus9)s,
            %(poolfilter_id)s, %(hidden)s, %(created_at)s, %(updated_at)s
        )
        ON CONFLICT (id)
        DO UPDATE SET
            "login" = EXCLUDED.login,
            "first_name" = EXCLUDED.first_name,
            "last_name" = EXCLUDED.last_name,
            "display_name" = EXCLUDED.display_name,
            "avatar_url" = EXCLUDED.avatar_url,
            "grade" = EXCLUDED.grade,
            "level" = EXCLUDED.level,
            "kind" = EXCLUDED.kind,
            "is_staff" = EXCLUDED.is_staff,
            "nbcursus" = EXCLUDED.nbcursus,
            "has_cursus21" = EXCLUDED.has_cursus21,
            "has_cursus9" = EXCLUDED.has_cursus9,
            "poolfilter_id" = EXCLUDED.poolfilter_id,
            "hidden" = EXCLUDED.hidden,
            "created_at" = EXCLUDED.created_at,
            "updated_at" = EXCLUDED.updated_at,
        """, {
            "login": user["login"],
            "first_name": good_firstname,
            "last_name": user["last_name"],
            "display_name": good_displayname,
            "avatar_url": good_avatar_url,
            "grade": user["grade"],
            "level": user["level"],
            "kind": user["kind"],
            "is_staff": user["is_staff"],
            "nbcursus": user["nbcursus"],
            "has_cursus21": user["has_cursus21"],
            "has_cursus9": user["has_cursus9"],
            "poolfilter_id": good_poolfilter_id,
            "hidden": user["hidden"],
            "created_at": user["created_at"],
            "updated_at": user["updated_at"],
        })


    return True


def import_users(update_strategy = "cursus"):
    global poolfilters

    local_users = executeQuerySelect("SELECT id, has_cursus21, updated_at FROM users")
    local_users = {user["id"]: user for user in local_users} 

    all_users = callapi("/v2/campus/47/users", True)
    cursus_users = callapi("/v2/campus/47/users", True)
    # cursus_users = {user["user"]["id"]: user for user in cursus_users} 
    cursus21_ids = [user["user"]["id"] for user in cursus_users]


    poolfilters = executeQuerySelect("SELECT * FROM poolfilters")


    for 



#update_strategy "all" => /campus + /v2/users/login    yearly creates if not exists
#update_strategy "cursus" => /v2/users/login only has_cursus_21    daily

#update_strategy "photos" => /v2/campus=sort-id * 200  rentree


import_users()