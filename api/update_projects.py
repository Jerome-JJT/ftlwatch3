


from _utils import *
from _dbConnector import *
from _api import *



# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])



def import_project_rule(rules, project_id):
    project_rules = executeQuerySelect("SELECT id FROM project_rules WHERE project_id = %(project_id)s",
    {
        "project_id": project_id
    })
    project_rules = [one["id"] for one in project_rules]

    for rule in rules:
        rule = rule['rule']

        good_id = f"""{project_id}_{rule["id"]}"""
        try:
            project_rules.remove(good_id)
        except:
            pass
        mylogger(f"Import project_team {good_id} {rule['name']}", LOGGER_INFO)


        executeQueryAction("""INSERT INTO project_rules (
            "id", "project_id", "rule_id"
        ) VALUES (
            %(id)s, %(project_id)s, %(rule_id)s
        )
        ON CONFLICT (id) DO NOTHING
        """, {
            "id": good_id,
            "project_id": project_id,
            "rule_id": rule["id"]
        })

    for toremove in project_rules:
        mylogger(f"Remove project_rule {toremove}", LOGGER_INFO)

        executeQueryAction("""DELETE FROM project_rules WHERE
            id = %(id)s
        )
        """, {
            "id": toremove
        })


def import_rule(rules):
    local_rules = None

    for rule in rules:
        rule = rule['rule']

        if (local_rules == None):
            local_rules = executeQuerySelect("SELECT id FROM rules")
            local_rules = [one['id'] for one in local_rules]

        if (rule['id'] not in local_rules):

            executeQueryAction("""INSERT INTO rules (
                "id", "name", "kind", "description", "slug", "internal_name"
                ) VALUES (
                %(id)s, %(name)s, %(kind)s, %(description)s, %(slug)s, %(internal_name)s
            )
            ON CONFLICT (id) DO NOTHING
            """, {
                "id": rule["id"], 
                "name": rule["name"],
                "kind": rule["kind"],
                "description": rule["description"],
                "slug": rule["slug"],
                "internal_name": rule["internal_name"]
            })
        
            local_rules = None
            # local_rules = executeQuerySelect("SELECT id FROM rules")
            # local_rules = [one['id'] for one in local_rules]



def import_projects(update_all = False):

    local_projects = executeQuerySelect("SELECT id FROM projects")
    local_projects = {one["id"]: one for one in local_projects} 

    if (len(local_projects) == 0):
        update_all = True

    projects = []

    if (update_all):
        projects = callapi("/v2/projects?sort=-id", True)
        # projects = callapi("/v2/projects?sort=id&page[number]=13", False)
    else:
        projects = callapi(f"/v2/projects?sort=-updated_at", False)


    for project in projects:

        mylogger(f"Import project {project['id']} {project['slug']}", LOGGER_INFO)

        good_cursus = None
        for cursus in project['cursus']:

            if (cursus['id'] == 21):
                good_cursus = cursus['id']
            elif (cursus['id'] == 9 and good_cursus not in [21]):
                good_cursus = cursus['id']
            elif (cursus['id'] == 3 and good_cursus not in [21, 9]):
                good_cursus = cursus['id']
            
        if (good_cursus == None and len(project['cursus']) > 0):
            good_cursus = project['cursus'][0]['id']


        good_session = None
        for session in project['project_sessions']:

            if (session['campus_id'] == 47):
                good_session = session
            elif (session['campus_id'] == None and good_session == None):
                good_session = session

        good_correction = None
        for scale in (good_session['scales'] if 'scales' in good_session.keys() else []):
            if (scale['is_primary'] == True):
                good_correction = scale['correction_number']

        has_moulinette = False
        for upload in (good_session['uploads'] if 'uploads' in good_session.keys() else []):
            if (upload['name'] == 'Moulinette'):
                has_moulinette = True

        good_rule_min = None
        good_rule_max = None
        good_rule_retry_delay = None
        if (good_cursus == 21 and good_session):
            rules = callapi(f"/v2/project_sessions/{good_session['id']}", False)

            for rule in rules['project_sessions_rules']:

                if (rule['rule']['slug'] == 'retriable-in-day'):
                    good_rule_retry_delay = rule['params'][0]['value']

                elif (rule['rule']['slug'] == 'group_validation-group-size-between-n-and-m'):
                    good_rule_min = rule['params'][0]['value']
                    good_rule_max = rule['params'][1]['value']

            import_rule(rules['project_sessions_rules'])
            import_project_rule(rules['project_sessions_rules'], project['id'])


        executeQueryAction("""INSERT INTO projects (
            "id", "name", "slug", "difficulty", "is_exam", "main_cursus", 

            "session_is_solo", "session_estimate_time", "session_description", 
            "session_has_moulinette", "session_correction_number",

            "rule_min", "rule_max", "rule_retry_delay",

            "created_at", "updated_at"
            
            ) VALUES (

            %(id)s, %(name)s, %(slug)s, %(difficulty)s, %(is_exam)s, %(main_cursus)s, 
            %(session_is_solo)s, %(session_estimate_time)s, %(session_description)s, 
            %(session_has_moulinette)s, %(session_correction_number)s, 
            %(rule_min)s, %(rule_max)s, %(rule_retry_delay)s, 
            %(created_at)s, %(updated_at)s
        )
        ON CONFLICT (id)
        DO UPDATE SET
            session_is_solo = EXCLUDED.session_is_solo,
            session_estimate_time = EXCLUDED.session_estimate_time,
            session_description = EXCLUDED.session_description,
            session_has_moulinette = EXCLUDED.session_has_moulinette,
            session_correction_number = EXCLUDED.session_correction_number,
            rule_min = EXCLUDED.rule_min,
            rule_max = EXCLUDED.rule_max,
            rule_retry_delay = EXCLUDED.rule_retry_delay,
            updated_at = EXCLUDED.updated_at
        """, {
            "id": project["id"], 
            "name": project["name"],
            "slug": project["slug"],
            "difficulty": project["difficulty"],
            "is_exam": project["exam"],
            "main_cursus": good_cursus,

            "session_is_solo": session["solo"],
            "session_estimate_time": session["estimate_time"],
            "session_description": session["description"],
            "session_has_moulinette": has_moulinette,
            "session_correction_number": good_correction,

            "rule_min": good_rule_min,
            "rule_max": good_rule_max,
            "rule_retry_delay": good_rule_retry_delay,

            "created_at": project["created_at"],
            "updated_at": project["updated_at"],
        })

            


import_projects(True)