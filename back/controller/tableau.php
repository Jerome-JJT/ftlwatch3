<?php
require_once("controller/_common.php");
require_once("model/users.php");
require_once("model/poolfilters.php");
require_once("model/simples/cursus.php");



function get_tableau_poolfilters()
{
    $poolfilters = array();
    
    
    if (has_permission("p_view4")) {
        $poolfilters = array_merge($poolfilters, getPoolFilters(has_permission("p_view4")));
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
    if (has_permission("p_view3") ) {
        array_unshift($poolfilters, array("name" => "currentyear", "hidden" => false));
    }
    if (has_permission("p_view2")) {
        array_unshift($poolfilters, array("name" => "currentmonth", "hidden" => false));
    }
    array_unshift($poolfilters, array("name" => "cursus", "hidden" => false));


    return $poolfilters;
}


function tableau_api($selectedFilter, $selectedProjects) {
    if ($selectedProjects == "") {
        $selectedProjects = "common-core";
    }

    $projectFilters = array();
    
    if (has_permission("p_view1")) {
        array_push($projectFilters, "infos");
    }
    array_push($projectFilters, "common-core", "outer-core");
    if (has_permission("p_view2")) {
        array_push($projectFilters, "c-piscine");
    }
    if (has_permission("p_view4")) {
        array_push($projectFilters, "internship");
    }

    $cursus = getCursus();
    $projectFiltersSlug = array_merge($projectFilters, array_map(function ($cursu) { return $cursu["slug"]; }, $cursus));


    if (!in_array($selectedProjects, $projectFiltersSlug)) {
        jsonResponse(array("error" => "Unknown or forbidden project filter"), 403);
    }

    if ($selectedFilter == "") {
        $selectedFilter = "cursus";
    }

    $poolFilters = get_tableau_poolfilters();
    $poolFiltersSlugs = array_map(function ($filter) { return $filter["name"]; }, $poolFilters);


    if (!in_array($selectedFilter, $poolFiltersSlugs)) {
        jsonResponse(array("error" => "Unknown or forbidden pool filter"), 403);
    }

    $currentFilter = getenv("CURRENT_POOL");
    if ($currentFilter === false) {
        $currentFilter = "2013.january";
    }

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
    
    $res["poolfilters"] = $poolFilters;
    $res["projects"] = $projectFilters;



    if ($selectedProjects === "infos") {
        $users = getUsers($selectedProjects == "all", $selectedFilter);

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
            ["label" => "Days", "field" => "blackhole_diff", "visible" => false],
            ["label" => "Begin", "field" => "begin_at", "visible" => false],
            ["label" => "End", "field" => "end_at"],
        ];
    }
    else {

        $teams = getUserProjects($selectedProjects == "all", $selectedFilter, $selectedProjects);
        
        
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
                    'has_cursus21' => $team['has_cursus21'],
                    'poolfilter' => $team['poolfilter'],
                    '_line_color' => $team['_line_color']
                );
            }

            if ($team['project_id'] != null) {

                if (!isset($cols[$team['project_slug']])) {
                    $cols[$team['project_slug']] = array(
                        "label" => $team['project_slug'],
                        "field" => $team['project_id'],
                        "corder" => $team['project_corder'],
                    );
                }
    
                $tmp[$team['user_id']][$team['project_id']] = $team['final_mark'];
            }
        }

        $res["columns"] = [
            ["label" => "ID", "field" => "user_id"],
            ["label" => "Image", "field" => "avatar_url"],
            ["label" => "Login", "field" => "login"],
            ["label" => "First Name", "field" => "first_name"],
            ["label" => "Last Name", "field" => "last_name"],
            ["label" => "Display Name", "field" => "display_name"]
        ];
        
        $res["columns"] = array_merge($res["columns"], 
            [
                ["label" => "Has Cursus 21", "field" => "has_cursus21", "visible" => false],
                ["label" => "Pool Filter", "field" => "poolfilter", "visible" => false]
            ]
        );

        $cols = array_values($cols);
        usort($cols, function($a, $b) {
            if($a['corder'] > $b['corder']) {
                return 1;
            }
            else if($a['corder'] < $b['corder']) {
                return -1;
            }
            else {
                return 0;
            }
        });

        $res["columns"] = array_merge($res["columns"], $cols);

        $res["values"] = array_values($tmp);
    }


    jsonResponse($res, 200);

}




function tableau_pools()
{
    $pools = array();

    $pools['all'] = array(
        'pool' => 'all',
        'participants' => 0,
        'selected' => 0,
        'blackholes' => 0,
        'incursus' => 0,
        'transcendead' => 0,
    );
    
    $users = getUsersPools();

    foreach ($users as $user) {

        if (!isset($pools[$user['poolfilter']])) {
            $pools[$user['poolfilter']] = array(
                'pool' => $user['poolfilter'],
                'participants' => 0,
                'selected' => 0,
                'blackholes' => 0,
                'incursus' => 0,
                'transcendead' => 0,
            );
        }

        $year = substr($user['poolfilter'], 0, 4);
        if (!isset($pools[$year])) {
            $pools[$year] = array(
                'pool' => $year,
                'participants' => 0,
                'selected' => 0,
                'blackholes' => 0,
                'incursus' => 0,
                'transcendead' => 0,
            );
        }

        $pools['all']['participants'] += 1;
        $pools[$year]['participants'] += 1;
        $pools[$user['poolfilter']]['participants'] += 1;

        if ($user['has_cursus21']) {
            $pools['all']['selected'] += 1;
            $pools[$year]['selected'] += 1;
            $pools[$user['poolfilter']]['selected'] += 1;

            if ($user['end_at'] == null || strtotime($user['end_at']) >= time()) {
                
                if ($user['grade'] == 'Member') {
                    $pools['all']['transcendead'] += 1;
                    $pools[$year]['transcendead'] += 1;
                    $pools[$user['poolfilter']]['transcendead'] += 1;
                }
                else {
                    $pools['all']['incursus'] += 1;
                    $pools[$year]['incursus'] += 1;
                    $pools[$user['poolfilter']]['incursus'] += 1;
                }
            }
            else {
                $pools['all']['blackholes'] += 1;
                $pools[$year]['blackholes'] += 1;
                $pools[$user['poolfilter']]['blackholes'] += 1;
            }
        }
    }


    foreach ($pools as $poolid => $pool) {

        $pools[$poolid]['_perc_selected'] = $pools[$poolid]['participants'] > 0 ? round(($pools[$poolid]['selected'] / $pools[$poolid]['participants']) * 100, 2) : 0;
        $pools[$poolid]['perc_selected'] = $pools[$poolid]['_perc_selected']." %";

        $pools[$poolid]['_perc_blackhole'] = $pools[$poolid]['selected'] > 0 ? round(($pools[$poolid]['blackholes'] / $pools[$poolid]['selected']) * 100, 2) : 0;
        $pools[$poolid]['perc_blackhole'] = $pools[$poolid]['_perc_blackhole']." %";

        $pools[$poolid]['_perc_incursus'] = $pools[$poolid]['selected'] > 0 ? round(($pools[$poolid]['incursus'] / $pools[$poolid]['selected']) * 100, 2) : 0;
        $pools[$poolid]['perc_incursus'] = $pools[$poolid]['_perc_incursus']." %";

        $pools[$poolid]['_perc_transcendead'] = $pools[$poolid]['selected'] > 0 ? round(($pools[$poolid]['transcendead'] / $pools[$poolid]['selected']) * 100, 2) : 0;
        $pools[$poolid]['perc_transcendead'] = $pools[$poolid]['_perc_transcendead']." %";
    }        
    

    $res = array();

    $res["columns"] = [
        ["label" => "Pool", "field" => "pool"],
        ["label" => "Participants", "field" => "participants"],

        ["label" => "Selected", "field" => "selected"],
        ["label" => "Perc Selected", "field" => "perc_selected"],

        ["label" => "Blackholes", "field" => "blackholes"],
        ["label" => "Perc Blackholes", "field" => "perc_blackhole"],

        ["label" => "In Cursus", "field" => "incursus"],
        ["label" => "Perc In Cursus", "field" => "perc_incursus"],

        ["label" => "Transcendead", "field" => "transcendead"],
        ["label" => "Perc Transcendead", "field" => "perc_transcendead"],
    ];

    $res["values"] = array_values($pools);

    jsonResponse($res, 200);

}
