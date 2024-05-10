<?php
require_once("controller/_common.php");
require_once("model/simples/achievements.php");



function get_achievements()
{
    $tmp = getAchievements();

    $res = array();

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}
