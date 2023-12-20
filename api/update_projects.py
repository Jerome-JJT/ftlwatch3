


from _dbConnector import *
from _api import *
import click
from dateutil import parser
import pytz

# any(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
# all(isinstance(e, int) and e > 0 for e in [1,2,'joe'])
existing_projects = []

def project_notification(fetched):
    from _utils_mylogger import mylogger, LOGGER_DEBUG, LOGGER_INFO, LOGGER_WARNING, LOGGER_ERROR
    from _rabbit import send_to_rabbit

    refer = executeQuerySelect("SELECT * FROM projects WHERE id = %(id)s", {
        "id": fetched["id"]
    })

    embed = {
        'message_type': 'embed',
        'url': f'https://projects.intra.42.fr/projects/{fetched["slug"]}',
        'description': f'https://42lwatch.ch/basics/projects/{fetched["slug"]}',
        'footer_text': parser.parse(fetched["updated_at"]).astimezone(tz=pytz.timezone('Europe/Zurich')).strftime('%Y-%m-%d %H:%M:%S')
    }

    if (len(refer) == 0):
        embed['title'] = f'Created project {fetched["id"]}, {fetched["slug"]}'
        refer = None
    else:
        embed['title'] = f'Updated project {fetched["id"]}, {fetched["slug"]}'
        refer = refer[0]


    check_fields = ["name", "slug", "difficulty", "is_exam", "main_cursus", "project_type_id", "has_lausanne", "parent_id",
            "session_id", "session_is_solo", "session_estimate_time", "session_duration_days", "session_terminating_after", 
            "session_description", "session_has_moulinette", "session_correction_number", "session_scale_duration",
            "rule_min", "rule_max", "rule_retry_delay", "rule_correction"]
    
    diffs = {}

    for check in check_fields:
        if (refer == None or refer[check] != fetched[check]):
            diffs[check] = f'ref: `{refer[check] if refer != None else None}`, new: `{fetched[check]}`'

    if (len(diffs.keys()) > 0):
        embed['fields'] = diffs

        mylogger(f"Nofified project {fetched['id']} {fetched['slug']}", LOGGER_INFO)
        send_to_rabbit('projects.server.message.queue', embed)



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

    good_parent_id = None
    if (project['parent'] != None):
        good_parent_id = project['parent']['id']


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
    good_rule_correction = []
    good_scale_duration = None
    if ((good_cursus == 21 or good_cursus == 9) and good_session):
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

        local_rule = {x['rule']['slug']: x for x in rules['project_sessions_rules'] }

        if (local_rule.get('retriable-in-days') != None):
            good_rule_retry_delay = local_rule.get('retriable-in-days')['params'][0]['value']

        if (local_rule.get('group_validation-group-size-between-n-and-m') != None):
            good_rule_min = local_rule.get('group_validation-group-size-between-n-and-m')['params'][0]['value']
            good_rule_max = local_rule.get('group_validation-group-size-between-n-and-m')['params'][1]['value']

        if (local_rule.get('correction-quest1-or-quest2-validated') != None):
            tmp = local_rule.get('correction-quest1-or-quest2-validated')['params'][0]['value']
            tmp = ", ".join(list(filter(lambda x: x != "42-to-42cursus-transfert", tmp.split(" "))))
            if (len(tmp) > 0):
                good_rule_correction.append(f'Quests: {tmp}')

        if (local_rule.get('correction-projects-registered') != None):
            tmp = local_rule.get('correction-projects-registered')['params'][0]['value']
            tmp = ", ".join(tmp.split(" "))
            if (len(tmp) > 0):
                good_rule_correction.append(f'Registered: {tmp}')

        if (local_rule.get('correction-projects-validated') != None):
            tmp = local_rule.get('correction-projects-validated')['params'][0]['value']
            tmp = ", ".join(tmp.split(" "))
            if (len(tmp) > 0):
                good_rule_correction.append(f'Validated: {tmp}')

        if (local_rule.get('correction-level-min') != None):
            tmp = ''
            for i in local_rule.get('correction-level-min')['params']:
                if (i["param_id"] == 9):
                    tmp = i["value"]

            if (len(tmp) > 0):
                good_rule_correction.append(f'Min level: {tmp}')

        good_rule_correction = " | ".join(good_rule_correction)

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

        "parent_id": good_parent_id,

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
        "rule_correction": good_rule_correction,

        "created_at": project["created_at"],
        "updated_at": project["updated_at"],
    }

    project_notification(good)

    executeQueryAction("""INSERT INTO projects (
        "id", "name", "slug", "difficulty", "is_exam", "main_cursus", "project_type_id", "has_lausanne", "parent_id", 

        "session_id", "session_is_solo", "session_estimate_time", "session_duration_days", "session_terminating_after", 
        "session_description", "session_has_moulinette", "session_correction_number", "session_scale_duration",

        "rule_min", "rule_max", "rule_retry_delay", "rule_correction",

        "created_at", "updated_at"
        
        ) VALUES (

        %(id)s, %(name)s, %(slug)s, %(difficulty)s, %(is_exam)s, %(main_cursus)s, %(project_type_id)s, %(has_lausanne)s, %(parent_id)s, 
        %(session_id)s, %(session_is_solo)s, %(session_estimate_time)s, %(session_duration_days)s, %(session_terminating_after)s,
        %(session_description)s, %(session_has_moulinette)s, %(session_correction_number)s, %(session_scale_duration)s, 
        %(rule_min)s, %(rule_max)s, %(rule_retry_delay)s, %(rule_correction)s, 
        %(created_at)s, %(updated_at)s
    )
    ON CONFLICT (id)
    DO UPDATE SET
        main_cursus = EXCLUDED.main_cursus,
        has_lausanne = EXCLUDED.has_lausanne,
        parent_id = EXCLUDED.parent_id,
        session_id = EXCLUDED.session_id,
        session_is_solo = EXCLUDED.session_is_solo,
        session_estimate_time = EXCLUDED.session_estimate_time,
        session_duration_days = EXCLUDED.session_duration_days,
        session_terminating_after = EXCLUDED.session_terminating_after,
        session_description = EXCLUDED.session_description,
        session_has_moulinette = EXCLUDED.session_has_moulinette,
        session_correction_number = EXCLUDED.session_correction_number,
        session_scale_duration = EXCLUDED.session_scale_duration,
        rule_min = EXCLUDED.rule_min,
        rule_max = EXCLUDED.rule_max,
        rule_retry_delay = EXCLUDED.rule_retry_delay,
        rule_correction = EXCLUDED.rule_correction,
        updated_at = EXCLUDED.updated_at
                       
    """, good)



def import_projects(update_all = False, start_at=1):
    global existing_projects
    from _utils_mylogger import mylogger, LOGGER_ALERT

    mylogger("Start projects worker", LOGGER_ALERT)
    existing_projects = executeQuerySelect("SELECT id FROM projects")
    existing_projects = {one["id"]: one for one in existing_projects} 

    if (len(existing_projects) == 0):
        update_all = True

    if (update_all):
        callapi("/v2/projects?sort=id", nultiple=start_at, callback=project_callback, callback_limit=False)
    else:
        callapi(f"/v2/projects?sort=-updated_at", nultiple=1, callback=project_callback, callback_limit=True)

    mylogger("End projects worker", LOGGER_ALERT)

        
@click.command()
@click.option("--update-all", "-a", type=bool, default=False, help="update all")
@click.option("--start-at", "-s", type=int, default=1, help="start at")

def starter(update_all=False, start_at=1):
    import_projects(update_all, start_at)
            

if __name__ == "__main__":
    starter()