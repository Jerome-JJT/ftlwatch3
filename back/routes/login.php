<?php

require_once("controller/login.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

switch($action)
{
    case "view":
        echo (password_hash("1234", PASSWORD_BCRYPT));
        require_once("view/login.html");
        exit();
        break;

    case "login":
        login($_POST);
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
