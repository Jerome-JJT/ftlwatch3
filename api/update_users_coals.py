


from _dbConnector import *
from _api import *


# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])

def user_coal_callback(coals):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    cursus21_coalition_id = None
    cursus9_coalition_id = None
    user_id = None


    for co in coals:
        user_id = co['user_id']
        if (co['coalition_id'] >= 191 and co['coalition_id'] <= 193):
            cursus21_coalition_id = co['coalition_id']

        if (co['coalition_id'] >= 166 and co['coalition_id'] <= 168):
            cursus9_coalition_id = co['coalition_id']

    mylogger(f"Import coals for {user_id}, 21: {cursus21_coalition_id}, 9: {cursus9_coalition_id}", LOGGER_INFO)

    if (user_id != None):
        executeQueryAction("""UPDATE users SET 
                        cursus21_coalition_id = COALESCE(%(cursus21_coalition_id)s, cursus21_coalition_id),
                        cursus9_coalition_id = COALESCE(%(cursus9_coalition_id)s, cursus9_coalition_id)
                        WHERE id = %(user_id)s
        """, {
            "cursus21_coalition_id": cursus21_coalition_id,
            "cursus9_coalition_id": cursus9_coalition_id,
            "user_id": int(user_id)
        })

    return True

def import_coals_users():
    from _utils_mylogger import mylogger, LOGGER_ALERT

    to_check = executeQuerySelect("""SELECT login FROM users WHERE kind = 'student' AND (blackhole > NOW() OR grade = 'Member')""")


    mylogger("Start users coals worker", LOGGER_ALERT)

    for check in to_check:
        tmp = callapi(f"/v2/users/{check['login']}/coalitions_users", False)
        user_coal_callback(tmp)


    mylogger("End users coals worker", LOGGER_ALERT)




if __name__ == "__main__":
    import_coals_users()