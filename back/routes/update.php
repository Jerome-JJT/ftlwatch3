<?php

require_once("controller/update.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

need_permission("p_admin");


switch ($action) {
    case "get":
        get();
        break;

    case "update":
        update($_POST["target"]);
        break;

}

exit();