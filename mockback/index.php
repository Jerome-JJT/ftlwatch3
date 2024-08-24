<?php


session_set_cookie_params(0, "/", null, false, true);

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// load_permissions();



function jsonResponse($data = array(), $code = 200, $isArray = false)
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    
    $flags = JSON_NUMERIC_CHECK;
    if (count($data) == 0) {
        $flags |= JSON_FORCE_OBJECT;
    }
    
    $flags |= JSON_PRETTY_PRINT;
    echo (json_encode($data, $flags));
    exit();
}
// print_r($_REQUEST);
// print_r($_SERVER);

$page = "";
if (isset($_GET["page"])) {
    $page = $_GET["page"];
}
$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

if ($page == 'login' && $action == 'authorizeapi') {
    setcookie("logged", "true");
    header("Location: /");
    exit();
}
if ($page == 'login' && $action == 'logout') {
    setcookie("logged", "false");
    jsonResponse(array(), 200);
}
if ($page == 'me' && $action == 'get') {
    if (isset($_COOKIE['logged']) && $_COOKIE['logged'] == 'true') {
        jsonResponse(array(
            "user" => array(
                "id" => 4242,
                "login" => "testuser",
                "display_name" => "Test user",
                "avatar_url" => "/favicon.ico",
                "css_click" => 42,
                "theme_id" => 1,
                "theme_image" => "",
                "theme_color" => "#9a2435",
                "terms" => true,
                "citation" => "",
                "citation_avatar" => ""
            ),
            "pages" => array(
                array(
                    "id" => 10,
                    "name" => "Campus",
                    "icon" => null,
                    "route" => "basics/campus",
                    "basefilter" => null,
                    "submenu_id" => 4
                ),
                array(
                    "id" => 15,
                    "name" => "Coalitions",
                    "icon" => null,
                    "route" => "basics/coalitions",
                    "basefilter" => null,
                    "submenu_id" => 4
                )
            )
        ), 200);
    }
    jsonResponse(array(), 401);
}

if ($page == 'me' && $action == 'calculator_get') {
    jsonResponse(array(
        "beginLevel" => 4.2,
        "projects" => array(
            array(
                "name" => "P1",
                "xp" => 1000
            ),
            array(
                "name" => "P2",
                "xp" => 100000
            )
        )
    ), 200);
}


jsonResponse(array(), 510);

