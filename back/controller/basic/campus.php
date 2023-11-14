<?php
require_once("controller/_common.php");
require_once("model/simples/campus.php");



function get_campus()
{
    $tmp = getCampus();

    $res = array();

    $res["columns"] = array(
        array("label" => "Id", "field" => "id"),
        array("label" => "Name", "field" => "name"),
        array("label" => "Country", "field" => "country"),
        array("label" => "City", "field" => "city"),
        array("label" => "Address", "field" => "address"),
        array("label" => "Timezone", "field" => "timezone"),
        array("label" => "Users count", "field" => "users_count"),
    );

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}
