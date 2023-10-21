<?php

require_once("controller/login.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

switch ($action) {
    case "view":
        echo (password_hash("1234", PASSWORD_BCRYPT));
        require_once("view/login.html");
        break;

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