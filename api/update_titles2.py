


from _utils import *
from _dbConnector import *
from _api import *



# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def import_titles(update_all = False):


    local_titles = executeQuerySelect("SELECT id FROM titles")
    local_titles = {title["id"]: title for title in local_titles} 

    if (len(local_titles) == 0):
        update_all = True

    titles = []

    update_all = True # Titles route is broken

    if (update_all):
        titles = callapi("/v2/titles?sort=id", True)
    else:

        num = 1
        while True:
            tmp = callapi(f"/v2/titles?sort=-id&page[number]={num}", False)

            titles.expand(tmp)
            if (len(tmp) == 0 or any(tmp["id"] in local_titles for i in tmp)):
                break

            num += 1


    for title in titles:

        if local_titles.get(title["id"]) == None:
            mylogger(f"Import title {title['id']} {title['name']}", LOGGER_INFO)

            executeQueryAction("""INSERT INTO titles (
                "id", "name") VALUES (

                %(id)s, %(name)s
            )
            ON CONFLICT DO NOTHING
            """, {
                "id": title["id"], 
                "name": title["name"]
            })
            


import_titles()