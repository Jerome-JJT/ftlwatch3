<?php

require_once("controller/poolfilters.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

switch ($action) {
    case "get":
        get($_POST);
        break;

}

exit();