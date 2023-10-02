<?php
require_once("controller/_common.php");
require_once("model/intra.php");
require_once("model/permissions/user_groups.php");
require_once("model/permissions/group_permissions.php");
require_once("model/permissions/page_permissions.php");



function groups_get()
{
    $tmp = getUserGroups();

    $res = array();

    $res["columns"] = array_merge(
        array(array("label" => "Login", "field" => "login")),
        array_map(function ($value) {
            return array("label" => $value["name"], "field" => $value["id"]);
        }, $tmp[0])
    );

    $res['values'] = $tmp[1];

    jsonResponse($res, 200);
}


function group_set($data)
{
    if (isset($data["userId"]) && isset($data["groupId"]) && isset($data["value"])) {

        $res = setUserGroup($data["userId"], $data["groupId"], $data["value"]);

        jsonResponse(array(), $res ? 200 : 409);
    } else {
        jsonResponse(array(), 400);
    }
}


function perms_get()
{
    $tmp = getGroupPerms();

    $res = array();

    $res["columns"] = array_merge(
        array(array("label" => "Group name", "field" => "name")),
        array_map(function ($value) {
            return array("label" => $value["name"], "field" => $value["id"]);
        }, $tmp[0])
    );

    $res['values'] = $tmp[1];

    jsonResponse($res, 200);
}


function perm_set($data)
{
    if (isset($data["groupId"]) && isset($data["permId"]) && isset($data["value"])) {

        $res = setGroupPerm($data["groupId"], $data["permId"], $data["value"]);

        jsonResponse(array(), $res ? 200 : 409);
    } else {
        jsonResponse(array(), 400);
    }
}

function pages_get()
{
    $tmp = getPagePermissions();

    $res = array();

    $res["columns"] = array_merge(
        // array(array("label" => "Name", "field" => "name")),
        array_map(function ($value) {
            return array("label" => $value["name"], "field" => $value["id"]);
        }, $tmp[0])
    );

    $res['values'] = $tmp[1];

    $res['permission_options'] = $tmp[2];

    jsonResponse($res, 200);
}

function page_set($data)
{
    if (isset($data["pageId"]) && isset($data["permissionId"])) {

        $res = setPagePermission($data["pageId"], $data["permissionId"]);

        jsonResponse(array(), $res ? 200 : 409);
    } //
    else if (isset($data["pageId"]) && isset($data["order"])) {

        $res = setPageOrder($data["pageId"], $data["order"]);

        jsonResponse(array(), $res ? 200 : 409);
    } //
    else {
        jsonResponse(array(), 400);
    }
}