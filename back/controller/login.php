<?php
require_once("controller/_common.php");
require_once("model/account.php");

function login_way($login) {
    $userInfos = getUserInfos($login);

    // TODO get rights and groups

    if (!isset($userInfos["error"])) {
        jsonlogger("SET USER", $userInfos, LOGGER_DEBUG());
        
        $_SESSION["user"] = $userInfos;
    }
    else {
        mylogger("GET USER INFOS ERROR".$userInfos["error"], LOGGER_ERROR());
        
    }
    jsonResponse($userInfos, !isset($userInfos["error"]) ? 200 : 400);
}


function login($post) {

    if (isset($post["login"]) && isset($post["password"])) {

        $isLogin = loginUser($post["login"], $post["password"], true);

        if ($isLogin) {
            login_way($post["login"]);
        }

        // print_r("value");
        // print_r($isLogin);
    }
    else {
        jsonResponse(array(), 400);
    }
}

function loginapi_authorize () {

	$authorization_redirect_url = "https://api.intra.42.fr/oauth/authorize?response_type=code";
	$authorization_redirect_url .= "&client_id=".getenv("API_UID")."&redirect_uri=".getenv("FRONT_PREFIX")."/loginapi"."&scope=public";

	header("Location: " . $authorization_redirect_url);
    exit();
}

function loginapi_callback($post) {

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
        }
        else {
            storeUser($meInfos, 1);
        }

        login_way($meInfos["login"]);

        // return ($token);
    }
    else {
        jsonResponse(array(), 400);
    }
}

function storeUser($res, $exists = 0) {
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
    }
    else {
        updateAccount($res["id"], $res["login"], $good_firstname, $res["last_name"], $good_displayname, $good_avatar_url, $good_number);
    }
}


function logout() {
    
    $_SESSION = array();
    session_destroy();
    jsonResponse(array(), 204);
}


function me() {
    
    // mylogger("ME ASKED ".$_SESSION["user"], LOGGER_DEBUG());
    // mylogger("ME ASKED ".implode(" ", array_keys($_SESSION["user"])), LOGGER_DEBUG());
    if (isset($_SESSION["user"])) {


        jsonResponse(array(
            "user" => $_SESSION["user"]
        ), 200);
    }
    else {
        jsonResponse(array(), 400);
    }

}