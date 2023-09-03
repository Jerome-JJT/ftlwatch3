<?php
require_once("controller/_common.php");
require_once("model/intra.php");
require_once("model/permissions.php");



function tableau_api($filter, $projects)
{

    // $validfilters = getPoolFilters(false);

    // foreach ($validfilters as $filter) {
    //     if (!in_array(substr($filter, 0, 4), $validfilters)) {
    //         array_push($validfilters, substr($filter, 0, 4));
    //     }
    // }

    // array_push($validfilters, "cursus");
    // array_push($validfilters, "all");

    // if ($filter == "") {
    //     $filter = "cursus";
    // }

    // if (!in_array($filter, $validfilters)) {
    //     jsonResponse(array("error" => "Unknown filter"), 404);
    // }

    //TODO static in DB
    $currentFilter = "2023september";

    // if (substr($filter, 0, 4) == substr($currentFilter, 0, 4)) {
    //     needOnePermission(array("tableau_currentyear"));
    // } else if ($currentFilter) {
    //     needOnePermission(array("tableau_currentpool"));
    // }



    $res = array();

    $users = getUsers($filter);

    $res["values"] = $users;

    $res["columns"] = [
        ["label" => "ID", "field" => "id", "sort" => true, "fixed" => true, "width" => 70],
        ["label" => "Image", "field" => "avatar_url", "sort" => true, "fixed" => true, "width" => 150],
        ["label" => "Login", "field" => "login", "sort" => true, "fixed" => true, "width" => 100],
        ["label" => "First Name", "field" => "first_name", "sort" => true],
        ["label" => "Last Name", "field" => "last_name", "sort" => true],
        ["label" => "Display Name", "field" => "display_name", "sort" => true],
        ["label" => "Grade", "field" => "grade", "sort" => true],
        ["label" => "Level", "field" => "level", "sort" => true],
        ["label" => "Kind", "field" => "kind", "sort" => true],
        ["label" => "Staff", "field" => "is_staff", "sort" => true],
        ["label" => "Nbcursus", "field" => "nbcursus", "sort" => true],
        ["label" => "Has Cursus 21", "field" => "has_cursus21", "sort" => true],
        ["label" => "Has Cursus 9", "field" => "has_cursus9", "sort" => true],
        ["label" => "Pool Filter", "field" => "poolfilter", "sort" => true]
    ];


    jsonResponse($res, 200);

}


function login($post)
{

    if (isset($post["login"]) && isset($post["password"])) {

        $isLogin = loginUser($post["login"], $post["password"], true);

        if ($isLogin) {
            login_way($post["login"]);
        }

        // print_r("value");
        // print_r($isLogin);
    } else {
        jsonResponse(array(), 400);
    }
}

function loginapi_authorize()
{

    $authorization_redirect_url = "https://api.intra.42.fr/oauth/authorize?response_type=code";
    $authorization_redirect_url .= "&client_id=" . getenv("API_UID") . "&redirect_uri=" . getenv("FRONT_PREFIX") . "/loginapi" . "&scope=public";

    header("Location: " . $authorization_redirect_url);
    exit();
}

function loginapi_callback($post)
{

    if (isset($post["code"])) {

        require_once("controller/api.php");
        $response = code_exchange($post["code"]);

        if ($response === false) {
            jsonResponse(array(), 406);
        }

        $raw = json_decode($response);

        if (isset($raw->error)) {
            jsonResponse(array("error" => $raw->error), 406);
        }

        $token = array("access_token" => $raw->access_token, "expires_in" => $raw->expires_in, "refresh_token" => $raw->refresh_token);

        $meInfos = getResource($token["access_token"], "/v2/me");

        if (isset($meInfos->status) && $meInfos->status == 401) {
            jsonResponse(array("error" => $meInfos->error), 401);
        }


        if (!loginUser($meInfos["login"], null, false)) {
            storeUser($meInfos, 0);
        } else {
            storeUser($meInfos, 1);
        }

        login_way($meInfos["login"]);

        // return ($token);
    } else {
        jsonResponse(array(), 400);
    }
}

function storeUser($res, $exists = 0)
{
    require_once("model/account.php");

    $good_firstname = isset($res["usual_first_name"]) ? $res["usual_first_name"] : $res["first_name"];
    $good_displayname = isset($res["usual_full_name"]) ? $res["usual_full_name"] : $res["displayname"];

    $good_avatar_url = "";
    if (isset($res["image"]["versions"]["medium"])) {
        $good_avatar_url = $res["image"]["versions"]["medium"];
    }
    if ($good_avatar_url == "" && isset($res["image"]["link"])) {
        $good_avatar_url = $res["image"]["link"];
    }

    $good_number = -1;
    if (isset($res['coalition_id'])) {
        $good_number = $res['coalition_id'];
    }

    if ($exists == 0) {
        createAccount($res["id"], $res["login"], $good_firstname, $res["last_name"], $good_displayname, $good_avatar_url, $good_number);
    } else {
        updateAccount($res["id"], $res["login"], $good_firstname, $res["last_name"], $good_displayname, $good_avatar_url, $good_number);
    }
}


function logout()
{

    $_SESSION = array();
    session_destroy();
    jsonResponse(array(), 204);
}