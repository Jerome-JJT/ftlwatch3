<?php
require_once("controller/_common.php");
require_once("model/account.php");

function login($post) {

    if (isset($post["login"]) && isset($post["password"])) {

        $isLogin = loginUser($post["login"], $post["password"]);

        if ($isLogin) {
            $userInfos = getUserInfos($post["login"]);

            // TODO get rights and groups

            if (!isset($userInfos["error"])) {
                $_SESSION["user"] = $userInfos;
            }
            jsonResponse($userInfos, !isset($userInfos["error"]) ? 200 : 400);
        }

        print_r("value");
        print_r($isLogin);
    }
    else {
        jsonResponse(array(), 400);
    }

}