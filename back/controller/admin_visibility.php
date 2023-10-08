<?php
require_once("controller/_common.php");
require_once("model/poolfilters.php");
require_once("model/users.php");



function poolfilters_get()
{
    $tmp = getPoolFilters(true);

    $res = array();

    $res["columns"] = array(
        array("label" => "Name", "field" => "name"),
        array("label" => "Hidden", "field" => "hidden"),
    );
    $res['values'] = $tmp;

    jsonResponse($res, 200);
}


function poolfilter_set($data)
{
    if (isset($data["poolfilterId"]) && isset($data["value"])) {

        $res = setPoolFilter($data["poolfilterId"], $data["value"]);

        jsonResponse(array(), $res ? 200 : 409);
    } else {
        jsonResponse(array(), 400);
    }
}



function users_get()
{
    $tmp = getUsersShort();

    $res = array();

    $res["columns"] = [
        ["label" => "ID", "field" => "id"],
        ["label" => "Image", "field" => "avatar_url"],
        ["label" => "Login", "field" => "login"],
        ["label" => "Hidden", "field" => "hidden"],
        ["label" => "Kind", "field" => "kind"],
        ["label" => "Staff", "field" => "is_staff"],
        ["label" => "Has Cursus 21", "field" => "has_cursus21"],
        ["label" => "Has Cursus 9", "field" => "has_cursus9"],
        ["label" => "Pool Filter", "field" => "poolfilter"]
    ];
    $res['values'] = $tmp;

    jsonResponse($res, 200);
}


function user_set($data)
{
    if (isset($data["userId"]) && isset($data["value"])) {

        $res = setUser($data["userId"], $data["value"]);

        jsonResponse(array(), $res ? 200 : 409);
    } else {
        jsonResponse(array(), 400);
    }
}
