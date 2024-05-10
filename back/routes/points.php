<?php

require_once("controller/points.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

need_permission("p_logged");

switch ($action) {
    case "get_points":
        get_points();
        break;
}

need_permission("p_watch");

switch ($action) {
    case "get_sales":
        get_pools();
        break;

    case "get_pools2":
        get_pools2();
        break;
}

exit();