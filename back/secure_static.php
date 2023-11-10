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

jsonlogger('SECURE PERMISSIONS ', $_REQUEST["permissions"], LOGGER_DEBUG());

try {
    $page = "";
    if (isset($_GET["page"])) {
        $page = $_GET["page"];
    }

    mylogger("REQUEST TO secure static " . $page, LOGGER_DEBUG());
    switch ($page) {

        case "test":
            include("/secure_static/test.html");
            die;
            break;
    }

    jsonResponse(array(), 404);

}
catch (Exception $e) {
    mylogger('Uncaught top level exception: ' . $e->getMessage(), LOGGER_ERROR());
    jsonResponse(array(), 500);
}