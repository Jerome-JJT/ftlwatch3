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

}

exit();