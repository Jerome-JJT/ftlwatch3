<?php

require_once("controller/teams.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

switch ($action) {
    case "get_teams":
        get_team_projects();
        break;

}

exit();