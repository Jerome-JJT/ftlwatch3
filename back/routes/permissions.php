<?php

require_once("controller/permissions.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

switch ($action) {
    case "get":
        get();
        break;

}

exit();