<?php

require_once("controller/login.php");
require_once("controller/me.php");

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

    case "me":
        me();
        break;

    // case "searchGame":
//   require_once("controler/gameGeneration.php");
//   searchGame($_POST);
//   break;

    // case "upload":
    //   require_once("controler/uploading.php");
    //   uploadTrack($_POST, $_FILES);
//   break;
}

exit();