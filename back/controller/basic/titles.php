<?php
require_once("controller/_common.php");
require_once("model/simples/titles.php");



function get_titles()
{
    $tmp = getTitles();

    $res = array();

    $res["columns"] = array(
        array("label" => "Id", "field" => "id"),
        array("label" => "Name", "field" => "name")
    );

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}
