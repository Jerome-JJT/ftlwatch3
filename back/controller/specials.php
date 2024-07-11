<?php
require_once("controller/_common.php");
require_once("model/profile.php");


function specials_tig($user) {
    
    $ban = getBanDate($user["id"]);

    if (in_array("ban_date", array_keys($ban))) {
        if ($ban["ban_date"] == null) {
            sentToRabbit("tig.server.message.queue", array('content' => 'Tig '.$user["login"]));
    
            setBanDate($user["id"], date("Y-m-d"));
            jsonResponse(array(), 201);
        }
        else if (strtotime($ban["ban_date"]) + 86400 < time()) {
            sentToRabbit("tig.server.message.queue", array('content' => 'Tig '.$user["login"]));
    
            setBanDate($user["id"], date("Y-m-d"));
            jsonResponse(array(), 201);
        }
        else {
            jsonResponse(array(), 412);
        }
    }
    
    jsonResponse(array(), 400);
}


function specials_css($user) {
    
    $number = getCss($user["id"])["css_click"];
    if ($number >= 0) {
        setIncrementCss($user["id"]);
        
        if (($number + 1) % min(100, pow(10, max(0, strlen(strval($number + 1)) - 2))) == 0) {
            sentToRabbit("complain.servercomplain.message.queue", array('content' => 'Complain '.$user["login"].' '.($number + 1)));
        }
    }
    else {
        jsonResponse(array("error" => "Coin-Coin"), 418);
    }

    jsonResponse(array(), 200);
}

