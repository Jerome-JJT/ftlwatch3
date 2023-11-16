


from _dbConnector import *
from _api import *



# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
existing_projects = []

# def project_notification(project):
#     global existing_projects

#     # if (project["id"] in existing_projects):
#     #     update
#     # else:



def import_project_rule(rules, project_id):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

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
        mylogger(f"Import project_rule {good_id} {rule['name']}", LOGGER_INFO)


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

        executeQueryAction("""DELETE FROM project_rules WHERE id = %(id)s
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


def project_callback(project):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR

    mylogger(f"Import project {project['id']} {project['slug']}", LOGGER_INFO)

    good_cursus = None
    good_project_type = None
    for cursus in project['cursus']:

        if (cursus['id'] == 21):
            good_cursus = cursus['id']
        elif (cursus['id'] == 9 and good_cursus not in [21]):
            good_cursus = cursus['id']
        elif (cursus['id'] == 3 and good_cursus not in [21, 9]):
            good_cursus = cursus['id']
        
    if (good_cursus == None and len(project['cursus']) > 0):
        good_cursus = project['cursus'][0]['id']

    if (good_cursus == 21):
        good_project_type = 3 # Outer core

    good_has_lausanne = False
    for campus in project['campus']:

        if (campus['id'] == 47):
            good_has_lausanne = True


    good_session = None
    backup_session = None
    for session in project['project_sessions']:

        if (session['campus_id'] == None):
            backup_session = session

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
    good_scale_duration = None
    if (good_cursus == 21 and good_session):
        rules = callapi(f"/v2/project_sessions/{good_session['id']}", False)
        scales = callapi(f"/v2/project_sessions/{good_session['id']}/scale_teams?sort=-updated_at&page[size]=1", False)

        try:
            good_scale_duration = scales[0]['scale']['duration']
        except:
            scales = callapi(f"/v2/project_sessions/{backup_session['id']}/scale_teams?sort=-updated_at&page[size]=1", False)
            try:
                good_scale_duration = scales[0]['scale']['duration']
            except:
                pass

        for rule in rules['project_sessions_rules']:

            if (rule['rule']['slug'] == 'retriable-in-days'):
                good_rule_retry_delay = rule['params'][0]['value']

            elif (rule['rule']['slug'] == 'group_validation-group-size-between-n-and-m'):
                good_rule_min = rule['params'][0]['value']
                good_rule_max = rule['params'][1]['value']

        import_rule(rules['project_sessions_rules'])
        import_project_rule(rules['project_sessions_rules'], project['id'])


    good = {
        "id": project["id"], 
        "name": project["name"],
        "slug": project["slug"],
        "difficulty": project["difficulty"],
        "is_exam": project["exam"],
        "main_cursus": good_cursus,
        "project_type_id": good_project_type,
        "has_lausanne": good_has_lausanne,

        "session_id": good_session["id"] if good_session else None,
        "session_is_solo": good_session["solo"] if good_session else None,
        "session_estimate_time": good_session["estimate_time"] if good_session else None,
        "session_duration_days": good_session["duration_days"] if good_session else None,
        "session_terminating_after": good_session["terminating_after"] if good_session else None,
        "session_description": good_session["description"] if good_session else None,
        "session_has_moulinette": has_moulinette,
        "session_correction_number": good_correction,
        "session_scale_duration": good_scale_duration,

        "rule_min": good_rule_min,
        "rule_max": good_rule_max,
        "rule_retry_delay": good_rule_retry_delay,

        "created_at": project["created_at"],
        "updated_at": project["updated_at"],
    }

    # project_notification(project)

    executeQueryAction("""INSERT INTO projects (
        "id", "name", "slug", "difficulty", "is_exam", "main_cursus", "project_type_id", "has_lausanne", 

        "session_id", "session_is_solo", "session_estimate_time", "session_duration_days", "session_terminating_after", 
        "session_description", "session_has_moulinette", "session_correction_number", "session_scale_duration",

        "rule_min", "rule_max", "rule_retry_delay",

        "created_at", "updated_at"
        
        ) VALUES (

        %(id)s, %(name)s, %(slug)s, %(difficulty)s, %(is_exam)s, %(main_cursus)s, %(project_type_id)s, %(has_lausanne)s, 
        %(session_id)s, %(session_is_solo)s, %(session_estimate_time)s, %(session_duration_days)s, %(session_duration_days)s,
        %(session_description)s, %(session_has_moulinette)s, %(session_correction_number)s, %(session_scale_duration)s, 
        %(rule_min)s, %(rule_max)s, %(rule_retry_delay)s, 
        %(created_at)s, %(updated_at)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        main_cursus = COALESCE(projects.main_cursus, EXCLUDED.main_cursus),
        has_lausanne = COALESCE(projects.has_lausanne, EXCLUDED.has_lausanne),
        session_id = COALESCE(projects.session_id, EXCLUDED.session_id),
        session_is_solo = COALESCE(projects.session_is_solo, EXCLUDED.session_is_solo),
        session_estimate_time = COALESCE(projects.session_estimate_time, EXCLUDED.session_estimate_time),
        session_duration_days = COALESCE(projects.session_duration_days, EXCLUDED.session_duration_days),
        session_terminating_after = COALESCE(projects.session_terminating_after, EXCLUDED.session_terminating_after),
        session_description = COALESCE(projects.session_description, EXCLUDED.session_description),
        session_has_moulinette = COALESCE(projects.session_has_moulinette, EXCLUDED.session_has_moulinette),
        session_correction_number = COALESCE(projects.session_correction_number, EXCLUDED.session_correction_number),
        session_scale_duration = COALESCE(projects.session_scale_duration, EXCLUDED.session_scale_duration),
        rule_min = COALESCE(projects.rule_min, EXCLUDED.rule_min),
        rule_max = COALESCE(projects.rule_max, EXCLUDED.rule_max),
        rule_retry_delay = COALESCE(projects.rule_retry_delay, EXCLUDED.rule_retry_delay),
        updated_at = EXCLUDED.updated_at
    """, {
        "id": good["id"], 
        "name": good["name"],
        "slug": good["slug"],
        "difficulty": good["difficulty"],
        "is_exam": good["is_exam"],
        "main_cursus": good["main_cursus"],
        "project_type_id": good["project_type_id"],
        "has_lausanne": good["has_lausanne"],

        "session_id": good["session_id"],
        "session_is_solo": good["session_is_solo"],
        "session_estimate_time": good["session_estimate_time"],
        "session_duration_days": good["session_duration_days"],
        "session_terminating_after": good["session_terminating_after"],
        "session_description": good["session_description"],
        "session_has_moulinette": good["session_has_moulinette"],
        "session_correction_number": good["session_correction_number"],
        "session_scale_duration": good["session_scale_duration"],

        "rule_min": good["rule_min"],
        "rule_max": good["rule_max"],
        "rule_retry_delay": good["rule_retry_delay"],

        "created_at": good["created_at"],
        "updated_at": good["updated_at"],
    })


def import_projects(update_all = False):
    global existing_projects
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start projects worker", LOGGER_ALERT)
    existing_projects = executeQuerySelect("SELECT id FROM projects")
    existing_projects = {one["id"]: one for one in existing_projects} 

    if (len(existing_projects) == 0):
        update_all = True

    if (update_all):
        callapi("/v2/projects?sort=id", True, project_callback, False)
    else:
        callapi(f"/v2/projects?sort=-updated_at", False, project_callback, True)

    mylogger("End projects worker", LOGGER_ALERT)

        

            

if __name__ == "__main__":
    import_projects(True)