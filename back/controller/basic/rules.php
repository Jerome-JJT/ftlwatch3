<?php
require_once("controller/_common.php");
require_once("model/simples/rules.php");



function get_rules()
{
    $tmp = getRules();

    $res = array();

    $res["columns"] = array(
        array("label" => "Id", "field" => "id"),
        array("label" => "Name", "field" => "name"),
        array("label" => "Description", "field" => "description"),
        array("label" => "Kind", "field" => "kind"),
        array("label" => "Slug", "field" => "slug"),
        array("label" => "Internal name", "field" => "internal_name")
    );

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}
