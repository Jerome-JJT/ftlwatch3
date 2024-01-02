<?php
require_once("controller/_common.php");
require_once("model/simples/projects.php");
require_once("model/projects.php");



function get_projects()
{
    $tmp = getProjects();
    $cursus = getCursus();

    $res = array();

    $res['cursus'] = $cursus;
    $res['values'] = $tmp;

    jsonResponse($res, 200);
}


function get_single_project($id)
{
    $project = getProject($id);
    
    if ($project) {
        $project_rules = getProjectRules($id);

        $project_subjects = getProjectSubjects($id);

        $tmp = array();
        foreach ($project_subjects as $subject) {
            if (!isset($tmp[$subject['id']])) {
                $tmp[$subject['id']] = array(
                    'id' => $subject['id'],
                    'title' => $subject['title'],
                    'title_hash' => $subject['title_hash'],
                    'project_slug' => $subject['project_slug'],
                    'subjects' => array(),
                );
            }
    
            array_push($tmp[$subject['id']]['subjects'], array(
                'id' => $subject['subject_id'],
                'url' => $subject['subject_url'],
                'date' => $subject['subject_date'],
            ));
        }
    

        $project["rules"] = $project_rules;
        $project["subjects"] = array_values($tmp);

        $res = array();
    
        $res['values'] = $project;
        
        jsonResponse($res, 200);
    }
    else {
        jsonResponse(array(), 404);
    }
}
