<?php
require_once("controller/_common.php");
require_once("model/users.php");
require_once("model/poolfilters.php");



function tableau_api($selectedFilter, $projects)
{

    $validFilters = getPoolFilters(has_permission("p_admin"));

    $validFilters = array_map(function ($filter) { return $filter["name"]; }, $validFilters);

    foreach ($validFilters as $filter) {
        if (!in_array(substr($filter, 0, 4), $validFilters)) {
            array_push($validFilters, substr($filter, 0, 4));
        }
    }

    array_push($validFilters, "cursus");
    array_push($validFilters, "all");
    array_push($validFilters, "currentmonth");
    array_push($validFilters, "currentyear");

    if ($selectedFilter == "") {
        $selectedFilter = "cursus";
    }

    if (!in_array($selectedFilter, $validFilters)) {
        jsonResponse(array("error" => "Unknown filter"), 404);
    }

    //TODO static in DB
    $currentFilter = "2023.september";

    if ($selectedFilter == "cursus") {
        need_permission("p_view1");
    }
    else if ($selectedFilter == "currentmonth") {
        need_permission("p_view2");
        $selectedFilter = $currentFilter;
    }
    else if ($selectedFilter == "currentyear") {
        need_permission("p_view3");
        $selectedFilter = substr($currentFilter, 0, 4);
    }
    else {
        need_permission("p_view4");
    }
    

    // print_r($selectedFilter);



    $res = array();

    $users = getUsers($selectedFilter);

    $res["values"] = $users;

    $res["columns"] = [
        ["label" => "ID", "field" => "id", "sort" => true, "fixed" => true, "width" => 70],
        ["label" => "Image", "field" => "avatar_url", "sort" => true, "fixed" => true, "width" => 150],
        ["label" => "Login", "field" => "login", "sort" => true, "fixed" => true, "width" => 100],
        ["label" => "First Name", "field" => "first_name", "sort" => true],
        ["label" => "Last Name", "field" => "last_name", "sort" => true],
        ["label" => "Display Name", "field" => "display_name", "sort" => true],
        ["label" => "Grade", "field" => "grade", "sort" => true],
        ["label" => "Level", "field" => "level", "sort" => true],
        ["label" => "Kind", "field" => "kind", "sort" => true],
        ["label" => "Staff", "field" => "is_staff", "sort" => true],
        ["label" => "Nbcursus", "field" => "nbcursus", "sort" => true],
        ["label" => "Has Cursus 21", "field" => "has_cursus21", "sort" => true],
        ["label" => "Has Cursus 9", "field" => "has_cursus9", "sort" => true],
        ["label" => "Pool Filter", "field" => "poolfilter", "sort" => true]
    ];


    jsonResponse($res, 200);

}

