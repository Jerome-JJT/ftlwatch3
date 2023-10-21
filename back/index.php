<?php

require_once("controller/_common.php");
require_once("controller/authorization.php");

http_response_code(501); // Return 501 by default if no response is specified

// header('Content-Type: application/json');
// header('Access-Control-Allow-Origin: http://c1r14s2:8080');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: Authorization,Content-Type,X-Requested-With");
if (getenv("ENV") == "DEV") {
    session_set_cookie_params(0, "/", null, false, true);
}
else {
    session_set_cookie_params(0, "/", null, true, true);
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    jsonResponse(array(), 200);
}

if (1 == 0) {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(-1);
}
else {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

session_start();

if (isset($_SESSION['user']) && (!isset($_SESSION['CREATED']) || (time() - $_SESSION['CREATED'] > 120 * 60))) {
    session_unset();
    session_destroy();
}

load_permissions();

jsonlogger('PERMISSIONS ', $_REQUEST["permissions"], LOGGER_DEBUG());

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

        case "me":
            require_once("routes/me.php");
            break;

        case "tableau":
            require_once("routes/tableau.php");
            break;

        case "admin":
            require_once("routes/admin.php");
            break;

        case "basic":
            require_once("routes/basic.php");
            break;

        case "poolfilters":
            require_once("routes/poolfilters.php");
            break;

        case "teams":
            require_once("routes/teams.php");
            break;


        // default:
            // print_r($_SERVER);
            // print_r("<br><br>");
            // print_r($_REQUEST);
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

    jsonResponse(array(), 510);

}
catch (Exception $e) {
    mylogger('Uncaught top level exception: ' . $e->getMessage(), LOGGER_ERROR());
    jsonResponse(array(), 500);
}