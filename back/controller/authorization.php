<?php
require_once("controller/_common.php");


// function login($data)
// {

//     if (isset($data["login"]) && isset($data["password"])) {

//         $isLogin = loginUser($data["login"], $data["password"], true);

//         if ($isLogin) {
//             login_way($data["login"]);
//         }
//     }
//     else {
//         jsonResponse(array(), 400);
//     }
// }

// function loginapi_authorize()
// {

//     $authorization_redirect_url = "https://api.intra.42.fr/oauth/authorize?response_type=code";
//     $authorization_redirect_url .= "&client_id=" . getenv("API_UID") . "&redirect_uri=" . getenv("FRONT_PREFIX") . "/loginapi" . "&scope=public";

//     header("Location: " . $authorization_redirect_url);
//     exit();
// }
