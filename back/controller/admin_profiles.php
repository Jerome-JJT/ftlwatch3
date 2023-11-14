<?php
require_once("controller/_common.php");

require_once("model/profile.php");

require_once("model/poolfilters.php");
require_once("model/users.php");
require_once("model/simples/projects.php");



function profiles_get()
{
    $tmp = getProfiles();

    $res = array();

    $res["themes"] = getThemes();

    $res["columns"] = array(
        ["label" => "ID", "field" => "user_id"],
        ["label" => "Image", "field" => "avatar_url"],
        ["label" => "Login", "field" => "login"],
        ["label" => "Modify", "field" => "modify"],

        ["label" => "Theme", "field" => "theme_id"],
        ["label" => "Color", "field" => "color"],

        ["label" => "Password", "field" => "password"],
        ["label" => "Github link", "field" => "github_link"],
        ["label" => "Banned", "field" => "ban_date"],
        ["label" => "Css", "field" => "css_click"],
        ["label" => "Ads", "field" => "ads"],
        ["label" => "Terms", "field" => "terms"]
    );
    $res['values'] = $tmp;

    jsonResponse($res, 200);
}


function profile_set($data)
{
    if (isset($data["user_id"])) {

        if (isset($data["theme_id"]) && 
            isset($data["color"]) && 
            isset($data["github_link"]) && 
            isset($data["terms"]) &&
            isset($data["can_change_theme"]) &&
            isset($data["citation"]) &&
            isset($data["citation_avatar"])
        ) {
                
            $res = setSettingsAdmin(
                $data["user_id"], 
                $data["theme_id"], 
                $data["color"], 
                $data["github_link"], 
                $data["terms"],
                $data["can_change_theme"],
                $data["citation"],
                $data["citation_avatar"]
            );
    
            jsonResponse(array(), $res ? 200 : 409);
        }
        jsonResponse(array(), 400);
    } 
    else {
        jsonResponse(array(), 400);
    }
}

function password_set($data)
{
    if (isset($data["user_id"]) && isset($data["password"])) {

        if (strlen($data["password"]) > 0) {

            $res = setPassword(
                $data["user_id"], 
                password_hash($data["password"], PASSWORD_BCRYPT)
            );

            jsonResponse(array(), $res ? 200 : 409);
        }
        else {
            $res = setPassword(
                $data["user_id"], 
                null
            );
            jsonResponse(array(), $res ? 200 : 409);
        }
    
    } 
    else {
        jsonResponse(array(), 400);
    }
}