<?php

require_once("controller/locations.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

$login = "";
if (isset($_GET["login"])) {
    $login = $_GET["login"];
}

need_permission("p_47student");

switch ($action) {
    case "get_users_computers":
        get_users_computers();
        break;

    case "get_users_totals":
        get_users_totals();
        break;

    case "get_computers_totals":
        get_computers_totals();
        break;

    case "get_personal_computers":
        get_personal_computers($_SESSION['user']['id'], $login);
        break;

}

exit();