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
    return isset($_REQUEST["permissions"]) && 
    (in_array("p_admin", $_REQUEST["permissions"]) || in_array($perm, $_REQUEST["permissions"]));
}

function need_permission($perm) {
    if (!has_permission($perm)) {

        $user = isset($_SESSION["user"]) && isset($_SESSION["user"]["login"]) ? $_SESSION["user"]["login"] : "anonymous";

        mylogger($user." missing perm ".$perm." has ".implode(", ", $_REQUEST["permissions"]), LOGGER_INFO());

        jsonResponse(array(), 403);
    }
}
