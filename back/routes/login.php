<?php

require_once("controller/login.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

switch ($action) {

    case "login":
        login($_POST);
        break;


    case "authorizeapi":
        loginapi_authorize();
        break;

    case "loginapi":
        loginapi_callback($_POST);
        break;

    case "logout":
        logout();
        break;
}

exit();