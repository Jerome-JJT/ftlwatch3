


from _utils import *
from _dbConnector import *
from _api import *





def import_users(update_all = False):


    local_users = executeQuerySelect("SELECT id FROM users")
    local_users = {user["id"]: user for user in local_users} 

    poolfilters = executeQuerySelect("SELECT * FROM poolfilters")

    all_users = callapi("/v2/campus/47/users", True)
    
    for user in all_users:

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
            poolfilters = executeQuerySelect("SELECT * FROM poolfilters")
        

        good_poolfilter_id = list(filter(lambda gfilter: gfilter["name"] == good_poolfilter, poolfilters))[0]["id"]


        if local_users.get(user["id"]) != None:

            continue
            # update
            # print("Found user")
            pass

        else:
            executeQueryAction("""INSERT INTO users (
                "id", "login", "first_name", "last_name", "display_name", 
                "avatar_url", "level", 
                "kind", "is_staff", "nbcursus", 
                "has_cursus21", "has_cursus9", "poolfilter_id") VALUES (

                %(id)s, %(login)s, %(first_name)s, %(last_name)s, %(display_name)s, 
                %(avatar_url)s, %(level)s,
                %(kind)s, %(is_staff)s, %(nbcursus)s,
                %(has_cursus21)s, %(has_cursus9)s, %(poolfilter_id)s
            )""", {
                "id": user["id"], 
                "login": user["login"], 
                "first_name": good_firstname, 
                "last_name": user["last_name"], 
                "display_name": good_displayname,
                "avatar_url": good_avatar_url, 
                "level": '', 
                "kind": user["kind"], 
                "is_staff": user["staff?"], 
                "nbcursus": -2, 
                "has_cursus21": False, 
                "has_cursus9": False, 
                "poolfilter_id": good_poolfilter_id,
            })
            



import_users()