<?php
require_once("controller/_common.php");
require_once("controller/authorization.php");
require_once("model/intra.php");



function get_tableau()
{

    $poolfilters = getPoolFilters(has_permission("p_admin"));

    array_unshift($poolfilters, array("id" => "-1", "name" => "all", "hidden" => false));
    array_unshift($poolfilters, array("id" => "-2", "name" => "currentyear", "hidden" => false));
    array_unshift($poolfilters, array("id" => "-3", "name" => "currentmonth", "hidden" => false));
    array_unshift($poolfilters, array("id" => "-4", "name" => "cursus", "hidden" => false));

    jsonResponse($poolfilters, 200);

}