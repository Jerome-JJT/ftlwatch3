<?php
require_once("controller/_common.php");
require_once("model/users.php");
require_once("model/poolfilters.php");
require_once("model/simples/cursus.php");



function get_tableau_poolfilters()
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
    if (has_permission("p_view3")) {
        array_unshift($poolfilters, array("name" => "currentyear", "hidden" => false));
    }
    if (has_permission("p_view2")) {
        array_unshift($poolfilters, array("name" => "currentmonth", "hidden" => false));
    }
    array_unshift($poolfilters, array("name" => "cursus", "hidden" => false));


    return $poolfilters;
}


// function get_tableau_projects()
// {
//     $projectFilters = array("infos", "42cursus", "common-core", "outer-core", "piscine-c");

    
//     if (has_permission("p_view4")) {
//         foreach ($poolfilters as $filter) {
//             $newKey = substr($filter["name"], 0, 4);
    
//             if ($newKey == "None") {
//                 continue;
//             }

//             if (!in_array($newKey, array_column($poolfilters, "name"))) {
//                 array_push($poolfilters, array("name" => $newKey, "hidden" => true));
//             }
//         }

//         array_unshift($poolfilters, array("name" => "all", "hidden" => true));
//     }
//     if (has_permission("p_view3")) {
//         array_unshift($poolfilters, array("name" => "currentyear", "hidden" => false));
//     }
//     if (has_permission("p_view2")) {
//         array_unshift($poolfilters, array("name" => "currentmonth", "hidden" => false));
//     }
//     array_unshift($poolfilters, array("name" => "cursus", "hidden" => false));


//     return $poolfilters;
// }



function tableau_api($selectedFilter, $selectedProjects)
{

    $filters = get_tableau_poolfilters();
    $validFilters = array_map(function ($filter) { return $filter["name"]; }, $filters);

    $projectFilters = array("infos", "common-core", "internship", "outer-core", "c-piscine");
    $cursus = getCursus();
    $validProjectFilters = array_merge($projectFilters, array_map(function ($cursu) { return $cursu["slug"]; }, $cursus));

    if ($selectedFilter == "") {
        $selectedFilter = "cursus";
    }
    if ($selectedProjects == "") {
        $selectedProjects = "42cursus";
    }

    if (!in_array($selectedFilter, $validFilters)) {
        jsonResponse(array("error" => "Unknown pool filter"), 404);
    }

    else if (!in_array($selectedProjects, $validProjectFilters)) {
        jsonResponse(array("error" => "Unknown project filter"), 404);
    }

    //TODO static in DB
    $currentFilter = "2023.september";

    if ($selectedFilter == "cursus" && in_array($selectedProjects, array("42cursus", "common-core", "outer-core"))) {
        need_permission("p_47student");
    }
    else if ($selectedFilter == "cursus" && in_array($selectedProjects, array("infos"))) {
        need_permission("p_view1");
    }
    else if ($selectedFilter == "currentmonth" && in_array($selectedProjects, array("c-piscine"))) {
        need_permission("p_view2");
        $selectedFilter = $currentFilter;
    }
    else if ($selectedFilter == "currentyear" && in_array($selectedProjects, array("c-piscine"))) {
        need_permission("p_view3");
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

    mylogger($selectedFilter, LOGGER_DEBUG());
    

    $res = array();
    
    $res["poolfilters"] = $filters;
    $res["projects"] = $projectFilters;



    if ($selectedProjects === "infos") {
        $users = getUsers(has_permission("p_view4"), $selectedFilter);

        $res["values"] = $users;
    
        $res["columns"] = [
            ["label" => "ID", "field" => "id"],
            ["label" => "Image", "field" => "avatar_url"],
            ["label" => "Login", "field" => "login"],
            ["label" => "First Name", "field" => "first_name", "visible" => false],
            ["label" => "Last Name", "field" => "last_name", "visible" => false],
            ["label" => "Display Name", "field" => "display_name"],

            ["label" => "Kind", "field" => "kind", "visible" => false],
            ["label" => "Staff", "field" => "is_staff", "visible" => false],
            ["label" => "Active", "field" => "is_active", "visible" => false],
            ["label" => "Alumni", "field" => "is_alumni", "visible" => false],
            ["label" => "BDE", "field" => "is_bde"],
            ["label" => "Tutor", "field" => "is_tutor"],
            
            ["label" => "Wallets", "field" => "wallet"],
            ["label" => "Points", "field" => "correction_point"],

            ["label" => "Grade", "field" => "grade", "visible" => false],
            ["label" => "Level", "field" => "level"],

            ["label" => "Pool Filter", "field" => "poolfilter"],
            ["label" => "Nbcursus", "field" => "nbcursus"],

            ["label" => "Has Cursus 21", "field" => "has_cursus21"],
            ["label" => "Has Cursus 9", "field" => "has_cursus9", "visible" => false],
            ["label" => "Coaltions 21", "field" => "cursus21_coalition"],
            ["label" => "Coalition 9", "field" => "cursus9_coalition", "visible" => false],

            ["label" => "Blackhole", "field" => "blackhole"],
        ];
    }
    else {

        $teams = getUserProjects(has_permission("p_view4"), $selectedFilter, $selectedProjects);
        
        
        $cols = array();
        $tmp = array();


        foreach ($teams as $team) {

            if (!isset($tmp[$team['user_id']])) {
                $tmp[$team['user_id']] = array(
                    'user_id' => $team['user_id'],
                    'login' => $team['login'],
                    'first_name' => $team['first_name'],
                    'last_name' => $team['last_name'],
                    'display_name' => $team['display_name'],
                    'avatar_url' => $team['avatar_url'],
                );
            }

            if ($team['project_id'] != null) {

                if (!isset($cols[$team['project_slug']])) {
                    $cols[$team['project_slug']] = array(
                        "label" => $team['project_slug'],
                        "field" => $team['project_id'],
                    );
                }
    
                $tmp[$team['user_id']][$team['project_id']] = $team['final_mark'];
            }
        }

        $res["columns"] = array_merge(
            [
                ["label" => "ID", "field" => "user_id"],
                ["label" => "Image", "field" => "avatar_url"],
                ["label" => "Login", "field" => "login"],
                ["label" => "First Name", "field" => "first_name"],
                ["label" => "Last Name", "field" => "last_name"],
                ["label" => "Display Name", "field" => "display_name"]
            ],
            array_values($cols)
        );
        

        $res["values"] = array_values($tmp);
    }


    jsonResponse($res, 200);

}

