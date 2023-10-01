<?php

require_once("controller/permissions.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}


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
}

exit();