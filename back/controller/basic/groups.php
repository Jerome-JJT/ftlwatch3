<?php
require_once("controller/_common.php");
require_once("model/simples/groups.php");



function get_groups()
{
    $tmp = getGroups();

    $res = array();

    $res["columns"] = array(
        array("label" => "Id", "field" => "id"),
        array("label" => "Name", "field" => "name"),
    );

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}
