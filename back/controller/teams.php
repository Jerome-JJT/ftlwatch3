<?php
require_once("controller/_common.php");
require_once("model/teams.php");



function get_group_projects()
{
    $res = array();

    $teams = getGroupProjects(21);


    $tmp = array();

    foreach ($teams as $team) {
        if ($team['retry_common'] != null) {

            if (isset($tmp[$team['retry_common']])) {

                if ($tmp[$team['retry_common']]['leader_id'] == -1 && $team['user_is_leader']) {
                    $tmp[$team['retry_common']]['leader_id']  = $team['user_id'];
                }
                $tmp[$team['retry_common']]['is_validated'] |= $team['is_validated'];
                $tmp[$team['retry_common']]['final_mark'] = max($tmp[$team['retry_common']]['final_mark'], $team['final_mark']);

                if ($tmp[$team['retry_common']]['current_team_id'] < $team['team_id']) {
                    
                    $tmp[$team['retry_common']]['current_team_id'] = $team['team_id'];
                    $tmp[$team['retry_common']]['current_locked'] = $team['is_locked'];
                    $tmp[$team['retry_common']]['current_status'] = $team['status'];
                    $tmp[$team['retry_common']]['current_updated_at'] = $team['team_updated_at'];
                }

                if (!isset($tmp[$team['retry_common']]['users'][$team['user_id']])) {

                    $tmp[$team['retry_common']]['users'][$team['user_id']] = array(
                        'id' => $team['user_id'], 
                        'login' => $team['login'], 
                        'avatar_url' => $team['avatar_url']
                    );
                }


                if (!isset($tmp[$team['retry_common']]['teams'][$team['team_id']])) {

                    $tmp[$team['retry_common']]['teams'][$team['team_id']] = array(
                        "id" => $team['team_id'],
                        "name" => $team['team_name'],
                        "final_mark" => $team['final_mark'],
                        "updated_at" => $team['team_updated_at']
                    );
                }
            }
            else {
                $tmp[$team['retry_common']] = array(
                    "retry_common" => $team['retry_common'],
                    "project_name" => $team['project_name'],
                    "team_name" => $team['team_name'],

                    "leader_id" => $team['user_is_leader'] ? $team['user_id'] : -1,
                    "is_validated" => $team['is_validated'],
                    "final_mark" => $team['final_mark'],
                    "current_team_id" => $team['team_id'],
                    "current_locked" => $team['is_locked'],
                    "current_status" => $team['status'],
                    "current_updated_at" => $team['team_updated_at'],

                    "users" => array(
                        $team['user_id'] => array(
                            'id' => $team['user_id'], 
                            'login' => $team['login'], 
                            'avatar_url' => $team['avatar_url']
                        )
                    ),
                    "teams" => array(
                        $team['team_id'] => array(
                            "id" => $team['team_id'],
                            "name" => $team['team_name'],
                            "final_mark" => $team['final_mark'],
                            "updated_at" => $team['team_updated_at']
                        )
                    ),
                );
            }
        }
    }


    $res["values"] = array_values($tmp);

    // $res["columns"] = [
    //     ["label" => "ID", "field" => "id", "sort" => true, "fixed" => true, "width" => 70],
    //     ["label" => "Image", "field" => "avatar_url", "sort" => true, "fixed" => true, "width" => 150],
    //     ["label" => "Login", "field" => "login", "sort" => true, "fixed" => true, "width" => 100],
    //     ["label" => "First Name", "field" => "first_name", "sort" => true],
    //     ["label" => "Last Name", "field" => "last_name", "sort" => true],
    //     ["label" => "Display Name", "field" => "display_name", "sort" => true],
    //     ["label" => "Grade", "field" => "grade", "sort" => true],
    //     ["label" => "Level", "field" => "level", "sort" => true],
    //     ["label" => "Kind", "field" => "kind", "sort" => true],
    //     ["label" => "Staff", "field" => "is_staff", "sort" => true],
    //     ["label" => "Nbcursus", "field" => "nbcursus", "sort" => true],
    //     ["label" => "Has Cursus 21", "field" => "has_cursus21", "sort" => true],
    //     ["label" => "Has Cursus 9", "field" => "has_cursus9", "sort" => true],
    //     ["label" => "Pool Filter", "field" => "poolfilter", "sort" => true]
    // ];


    jsonResponse($res, 200);

}





function get_tinder()
{
    $res = array();

    $userProjects = getUserProjects();
    $userProjectScore = getProjectsCount();
    $userExamScore = getExamCount();


    $userDoneProjects = array();

    foreach ($userProjects as $project) {
        if ($project["is_locked"] >= 1) {

            if (isset($userDoneProjects[$project["user_id"]])) {
                array_push($userDoneProjects[$project["user_id"]]["projects"], $project["project_slug"]);
            }
            else {
                $userDoneProjects[$project["user_id"]] = array(
                    "user_id" => $project["user_id"],
                    "login" => $project["login"],
                    "avatar_url" => $project["avatar_url"],
                    "projects" => array($project["project_slug"]), 
                    "score" => 0
                );;
            }
        }
    }

    foreach ($userProjectScore as $score) {
        if (isset($userDoneProjects[$score["user_id"]])) {
            $userDoneProjects[$score["user_id"]]["score"] += $score["validated"];
        }
    }
    foreach ($userExamScore as $score) {
        if (isset($userDoneProjects[$score["user_id"]])) {
            $userDoneProjects[$score["user_id"]]["score"] += $score["validated"];
        }
    }


    $filters = array(
        "circle3" => array("projects" => array("42cursus-minishell"), "prev" => 6, "min" => 7.5, "max" => 9),
        "circle4" => array("projects" => array("cub3d", "minirt"), "prev" => 8.5, "min" => 10, "max" => 16.5),
        "circle5" => array("projects" => array("webserv", "ft_irc"), "prev" => 16, "min" => 17.5, "max" => 24),
        "circle6" => array("projects" => array("ft_transcendence"), "prev" => 23.5, "min" => 25, "max" => 25.5),
    );


    $tmp = array();
    foreach (array_keys($filters) as $filter_key) {
        $tmp[$filter_key] = array();
    }


    foreach ($userDoneProjects as $user) {

        foreach ($filters as $filter_key => $filter) {
            $flag = false;
            foreach ($filter["projects"] as $check) {
                $flag |= in_array($check, $user["projects"]);
            }

            if ($flag) {
                continue;
            }

            if ($user["score"] >= $filter["prev"]) {

                $score = 50;
                if ($user["score"] <= $filter["min"]) {
                    $score = map($user["score"], $filter["prev"], $filter["min"], 50, 100);
                }
                else {
                    $score = map($user["score"], $filter["min"], $filter["max"], 100, 200);
                }
                if ($score > 200) {
                    continue;
                }

                array_push($tmp[$filter_key], array(

                    "user_id" => $user["user_id"],
                    "login" => $user["login"],
                    "avatar_url" => $user["avatar_url"],
                    "score" => $score
                ));
            }
        }
    }

    $res = array();

    $res["filters"] = $filters;
    $res["values"] = $tmp;


    jsonResponse($res, 200);

}


