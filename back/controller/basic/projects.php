<?php
require_once("controller/_common.php");
require_once("model/simples/projects.php");



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

        $project["rules"] = $project_rules;

        $res = array();
    
        $res['values'] = $project;
        
        jsonResponse($res, 200);
    }
    else {
        jsonResponse(array(), 404);
    }
}
