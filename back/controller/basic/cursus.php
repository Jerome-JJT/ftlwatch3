<?php
require_once("controller/_common.php");
require_once("model/simples/cursus.php");



function get_cursus()
{
    $tmp = getCursus();

    $res = array();

    $res["columns"] = array(
        array("label" => "Id", "field" => "id"),
        array("label" => "Name", "field" => "name"),
        array("label" => "Slug", "field" => "slug"),
        array("label" => "Kind", "field" => "kind"),
    );

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}
