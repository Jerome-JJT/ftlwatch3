<?php
require_once("controller/_common.php");
require_once("model/users.php");
require_once("model/poolfilters.php");
require_once("model/simples/cursus.php");



function get_image_poolfilters()
{
    $poolfilters = getPoolFilters(has_permission("p_view4"));

    
    if (has_permission("p_view4")) {
        foreach ($poolfilters as $filter) {
            $newKey = substr($filter["name"], 0, 4);
    
            if ($newKey == "None") {
                continue;
            }

            if (!in_array($newKey, array_column($poolfilters, "name"))) {
                array_push($poolfilters, array("name" => $newKey, "hidden" => true));
            }
        }

        array_unshift($poolfilters, array("name" => "all", "hidden" => true));
    }
    if (has_permission("p_view2")) {
        array_unshift($poolfilters, array("name" => "currentyear", "hidden" => false));
    }
    if (has_permission("p_view1")) {
        array_unshift($poolfilters, array("name" => "currentmonth", "hidden" => false));
    }
    array_unshift($poolfilters, array("name" => "cursus", "hidden" => false));


    return $poolfilters;
}


function image_api($selectedFilter)
{
    if ($selectedFilter == "") {
        $selectedFilter = "cursus";
    }

    $poolFilters = get_image_poolfilters();
    $poolFiltersSlugs = array_map(function ($filter) { return $filter["name"]; }, $poolFilters);


    if (!in_array($selectedFilter, $poolFiltersSlugs)) {
        jsonResponse(array("error" => "Unknown pool filter"), 404);
    }

    //TODO static in DB
    $currentFilter = "2023.september";

    if ($selectedFilter == "cursus") {
        need_permission("p_47student");
    }
    else if ($selectedFilter == "currentmonth") {
        need_permission("p_view1");
        $selectedFilter = $currentFilter;
    }
    else if ($selectedFilter == "currentyear") {
        need_permission("p_view2");
        $selectedFilter = substr($currentFilter, 0, 4);
    }
    else {
        need_permission("p_view4");
    }

    if ($selectedFilter == "currentmonth") {
        $selectedFilter = $currentFilter;
    }
    else if ($selectedFilter == "currentyear") {
        $selectedFilter = substr($currentFilter, 0, 4);
    }


    $res = array();
    
    $res["poolfilters"] = $filters;


    $users = getUserImages($selectedFilter == "all", $selectedFilter);

    $res["values"] = $users;


    jsonResponse($res, 200);

}

