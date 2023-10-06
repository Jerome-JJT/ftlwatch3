<?php
require_once("controller/_common.php");
require_once("model/intra.php");



function tableau_api($filter, $projects)
{

    // $validfilters = getPoolFilters(false);

    // foreach ($validfilters as $filter) {
    //     if (!in_array(substr($filter, 0, 4), $validfilters)) {
    //         array_push($validfilters, substr($filter, 0, 4));
    //     }
    // }

    // array_push($validfilters, "cursus");
    // array_push($validfilters, "all");

    // if ($filter == "") {
    //     $filter = "cursus";
    // }

    // if (!in_array($filter, $validfilters)) {
    //     jsonResponse(array("error" => "Unknown filter"), 404);
    // }

    //TODO static in DB
    $currentFilter = "2023september";

    // if (substr($filter, 0, 4) == substr($currentFilter, 0, 4)) {
    //     needOnePermission(array("tableau_currentyear"));
    // } else if ($currentFilter) {
    //     needOnePermission(array("tableau_currentpool"));
    // }



    $res = array();

    $users = getUsers($filter);

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

