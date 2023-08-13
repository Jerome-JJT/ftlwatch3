<?php

require_once("controller/_common.php");

header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: X-Requested-With");
session_set_cookie_params(0, "/", $_SERVER["SERVER_NAME"], true, true);

session_start();

// print_r($_SERVER);

// $json = file_get_contents('php://input');
// $data = json_decode($json);
// print_r($data);
// print_r("end<br>");
// print_r($_REQUEST);
// print_r($_SERVER);

try {
    $page = "";
    if (isset($_GET["page"])) {
        $page = $_GET["page"];
    }

    mylogger("REQUEST TO page " . $page, LOGGER_DEBUG());
    switch ($page) {
        case "login":
            require_once("routes/login.php");
            break;


        default:
            print_r($_SERVER);
            print_r("<br><br>");
            print_r($_REQUEST);
        // print_r($_SERVER);


        // case "generateGame":
        //   require_once("controler/gameGeneration.php");
        //   generateGame($_POST);
        //   break;

        // case "searchGame":
        //   require_once("controler/gameGeneration.php");
        //   searchGame($_POST);
        //   break;

        // case "upload":
        //   require_once("controler/uploading.php");
        //   uploadTrack($_POST, $_FILES);
        //   break;
    }

} catch (Exception $e) {
    mylogger('Uncaught top level exception: ' . $e->getMessage(), LOGGER_ERROR());
    jsonResponse(array(), 500);
}