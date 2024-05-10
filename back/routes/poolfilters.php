<?php

require_once("controller/poolfilters.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}


need_permission("p_47student");

switch ($action) {
    case "get_tableau":
        get_tableau();
        break;

}

exit();