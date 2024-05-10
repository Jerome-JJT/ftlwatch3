<?php

require_once("controller/events.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

need_permission("p_event");

switch ($action) {
    case "get":
        get_events();
        break;

}

exit();