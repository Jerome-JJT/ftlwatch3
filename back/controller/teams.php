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


