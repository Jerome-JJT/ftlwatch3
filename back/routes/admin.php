<?php

require_once("controller/authorization.php");
require_once("controller/admin_permissions.php");
require_once("controller/admin_visibility.php");
require_once("controller/admin_profiles.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

need_permission("p_admin");

switch ($action) {
    case "groups_get":
        groups_get();
        break;

    case "group_set":
        group_set($_POST);
        break;

    case "perms_get":
        perms_get();
        break;

    case "perm_set":
        perm_set($_POST);
        break;

    case "pages_get":
        pages_get();
        break;

    case "page_set":
        page_set($_POST);
        break;

    case "poolfilters_get":
        poolfilters_get();
        break;

    case "poolfilter_set":
        poolfilter_set($_POST);
        break;

    case "users_get":
        users_get();
        break;

    case "user_set":
        user_set($_POST);
        break;

    case "profiles_get":
        profiles_get();
        break;

    case "profile_set":
        profile_set($_POST);
        break;

    case "password_set":
        password_set($_POST);
        break;

    case "projects_get":
        projects_get();
        break;

    case "project_set":
        project_set($_POST);
        break;
}

exit();