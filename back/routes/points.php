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

    case "get_pools":
        get_pools();
        break;
}

exit();