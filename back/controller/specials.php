<?php
require_once("controller/_common.php");
require_once("model/profile.php");


function specials_tig($user) {
    
    $ban = getBanDate($user["id"]);

    if (isset($ban["ban_date"])) {
        if ($ban["ban_date"] == null) {
            sentToRabbit("tig.server.message.queue", array('content' => 'Tig '.$login));
    
            setBanDate($userId, date("Y-m-d"));
            jsonResponse(array(), 201);
        }
        else if (strtotime($ban["ban_date"]) + 86400 < time()) {
            sentToRabbit("tig.server.message.queue", array('content' => 'Tig '.$login));
    
            setBanDate($userId, date("Y-m-d"));
            jsonResponse(array(), 201);
        }
        else {
            jsonResponse(array(), 412);
        }
    }
    
    jsonResponse(array(), 400);
}


function specials_css($user) {
    
    setIncrementCss($user["id"]);
    sentToRabbit("complain.server.message.queue", array('content' => 'Complain '.$login.' '.getCss($userId)));

    jsonResponse(array(), 200);
}

