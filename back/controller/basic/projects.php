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
