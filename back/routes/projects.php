<?php

require_once("controller/projects.php");

$action = "";
if (isset($_GET["action"])) {
	$action = $_GET["action"];
}

need_permission("p_47student");

switch ($action) {
<<<<<<< HEAD
	case "get_teams":
		get_group_projects();
		break;

	case "get_tinder":
		get_tinder();
		break;

	case "get_subjects":
		get_subjects("all");
		break;
	case "get_unmatched_subjects":
		get_subjects("unmatched");
		break;
	case "get_subject":
		get_subject(isset($_GET["id"]) ? $_GET["id"] : -1);
		break;
	case "get_xp_info":
		get_xp_info($_SESSION['user']['id']);
		break;
=======
    case "get_teams":
        get_group_projects();
        break;

    case "get_rushes":
        get_rush_projects();
        break;

    case "get_tinder":
        get_tinder();
        break;

    case "get_subjects":
        get_subjects("all");
        break;
    case "get_unmatched_subjects":
        get_subjects("unmatched");
        break;
    case "get_subject":
        get_subject(isset($_GET["id"]) ? $_GET["id"] : -1);
        break;
>>>>>>> 7a78a289d48547b76db6b8082bb7302810557a21

}

exit();