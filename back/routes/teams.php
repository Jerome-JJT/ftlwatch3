<?php

require_once("controller/teams.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

need_permission("p_47student");

switch ($action) {
    case "get_teams":
        get_group_projects();
        break;

    case "get_tinder":
        get_tinder();
        break;

}

exit();