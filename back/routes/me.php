<?php

require_once("controller/me.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

switch ($action) {

    case "get":
        me(isset($_GET["reload"]));
        break;

    case "themes_get":
        themes_get();
        break;

    case "settings_set":
        settings_set($_POST);
        break;

}

exit();