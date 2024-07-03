<?php
require_once("controller/_common.php");
require_once("model/account.php");
require_once("model/permissions/permissions.php");
require_once("model/permissions/user_groups.php");

function login_way($login)
{
    $userInfos = getUserInfos($login);
    
    // TODO get rights and groups
    
    if (!isset($userInfos["error"])) {
        jsonlogger("SET USER", $userInfos, LOGGER_DEBUG());

        $_SESSION["user"] = $userInfos;
        $_SESSION["pages"] = getUserPages($userInfos["id"]);
        $_SESSION['CREATED'] = time();
    } else {
        mylogger("GET USER INFOS ERROR" . $userInfos["error"], LOGGER_ERROR());

    }
    jsonResponse($userInfos, !isset($userInfos["error"]) ? 200 : 400);
}


function login($post)
{
    if (isset($post["login"]) && isset($post["password"])) {

        $isLogin = loginUser($post["login"], $post["password"], true);

        if ($isLogin) {
            login_way($post["login"]);
        }
        jsonResponse(array(), 400);

    }
    else {
        jsonResponse(array(), 400);
    }
}

function loginapi_authorize($next)
{
    $redirect_uri = getenv("CALLBACK_URL");
    if (strlen($next) > 0) {
        $redirect_uri .= "?next=" . $next;
    }


    $authorization_redirect_url = "https://api.intra.42.fr/oauth/authorize?response_type=code";
    $authorization_redirect_url .= "&client_id=" . getenv("API_UID") . "&scope=public";
    $authorization_redirect_url .= "&redirect_uri=" . urlencode($redirect_uri);

    header("Location: " . $authorization_redirect_url);
    exit();
}

function loginapi_callback($post)
{

    if (isset($post["code"])) {

        require_once("controller/api.php");
        $response = code_exchange($post["code"], isset($post["next"]) ? $post["next"] : "");

        if ($response === false) {
            jsonResponse(array(), 406);
        }

        $raw = json_decode($response);

        if (isset($raw->error)) {
            if ($raw->error == "invalid_client") {
                mylogger('API key probably expired', LOGGER_ERROR());
            }
            jsonResponse(array("error" => $raw->error), 406);
        }

        $token = array("access_token" => $raw->access_token, "expires_in" => $raw->expires_in, "refresh_token" => $raw->refresh_token);
        $_SESSION["token"] = $raw->access_token;

        $meInfos = getResource($token["access_token"], "/v2/me");

        if (isset($meInfos->status) && $meInfos->status == 401) {
            jsonResponse(array("error" => $meInfos->error), 401);
        }
        else if(isset($meInfos["data"])) {
            jsonResponse(array("error" => "duck api, retry"), 418);
        }

        jsonlogger('Response', $meInfos, LOGGER_DEBUG());


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

    if ($exists == 0) {
        createAccount($res["id"], $res["login"], $good_firstname, $res["last_name"], $good_displayname, $good_avatar_url);
    } else {
        updateAccount($res["id"], $res["login"], $good_firstname, $res["last_name"], $good_displayname, $good_avatar_url);
    }

    $singleGroup = upsertUserGroup($res["id"], $res["login"]);
    $perms = array();

    if (in_array(47, array_column($res['campus'], 'id'))) {

        array_push($perms, 'g_logged');

        if (in_array(21, array_column($res['cursus_users'], 'cursus_id')) && in_array(47, array_column($res['campus'], 'id'))) {
            array_push($perms, 'g_47student');
        }
        
        if (in_array('BDE', array_column($res['groups'], 'name'))) {
            array_push($perms, 'g_bde');
        }

        if (in_array('Tutor', array_column($res['groups'], 'name'))) {
            array_push($perms, 'g_tutor');
        }
        
        if (in_array($res['id'], array(92477))) {
            array_push($perms, 'g_admin', 'g_event', 'g_perm', 'g_stalk1', 'g_stalk2', 'g_stalk3', 'g_stalk4');
        }
    }

    

    setUserGroupBySlugs($res["id"], $perms);
}


function logout()
{
    $_SESSION = array();
    session_destroy();
    jsonResponse(array(), 204);
}
