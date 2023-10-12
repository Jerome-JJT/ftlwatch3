


from _utils import *
from _dbConnector import *
from _api import *


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def bloc_callback(bloc):

    for coalition in bloc['coalitions']:
        mylogger(f"Import coalition {coalition['id']} {coalition['name']}", LOGGER_INFO)

        executeQueryAction("""INSERT INTO coalitions (
            "id", "name", "slug", "image_url", "cover_url", 
            "color", "campus_id", "cursus_id", "bloc_id"
        ) VALUES (
            %(id)s, %(name)s, %(slug)s, %(image_url)s, %(cover_url)s, 
            %(color)s, %(campus_id)s, %(cursus_id)s, %(bloc_id)s
        )
        ON CONFLICT (id)
        DO UPDATE SET
            "name" = EXCLUDED.name,
            "slug" = EXCLUDED.slug,
            "image_url" = EXCLUDED.image_url,
            "cover_url" = EXCLUDED.cover_url,
            "color" = EXCLUDED.color,
            "campus_id" = EXCLUDED.campus_id,
            "cursus_id" = EXCLUDED.cursus_id,
            "bloc_id" = EXCLUDED.bloc_id
        """, {
            "id": coalition["id"],
            "name": coalition["name"],
            "slug": coalition["slug"],
            "image_url": coalition["image_url"],
            "cover_url": coalition["cover_url"],
            "color": coalition["color"],
            "campus_id": bloc["campus_id"],
            "cursus_id": bloc["cursus_id"],
            "bloc_id": bloc["id"]
        })

    return True

def import_coalitions():

    callapi("/v2/blocs?sort=id", True, bloc_callback, False)





import_coalitions()