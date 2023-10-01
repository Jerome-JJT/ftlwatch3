<?php
require_once("controller/_common.php");
require_once("model/permissions/permissions.php");


function load_permissions() {

    if (isset($_SESSION["user"]) && isset($_SESSION["user"]["id"])) {

        $permissions = getUserPermissions($_SESSION["user"]["id"]);

        $_REQUEST["permissions"] = array_column($permissions, "permission_slug");
    }
    else {
        $_REQUEST["permissions"] = array();
    }
}

function has_permission($perm) {
    return in_array($perm, $_REQUEST["permissions"]);
}

function need_permission($perm) {
    if (!has_permission($perm)) {

        jsonResponse(array(), 403);
    }
}
