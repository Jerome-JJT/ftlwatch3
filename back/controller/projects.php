<?php
require_once("controller/_common.php");
require_once("model/projects.php");
require_once("model/simples/projects.php");
require_once("model/users.php");


function get_group_projects()
{
	$res = array();

	$teams = getGroupProjects(21);


	$tmp = array();

	foreach ($teams as $team) {
		if ($team['retry_common'] != null) {

			if (isset($tmp[$team['retry_common']])) {

				if ($tmp[$team['retry_common']]['leader_id'] == -1 && $team['user_is_leader']) {
					$tmp[$team['retry_common']]['leader_id'] = $team['user_id'];
					$tmp[$team['retry_common']]['projects_user_id'] = $team['projects_user_id'];
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
			} else {
				$tmp[$team['retry_common']] = array(
					"retry_common" => $team['retry_common'],
					"project_name" => $team['project_name'],
					"project_slug" => $team['project_slug'],
					"team_name" => $team['team_name'],

					"leader_id" => $team['user_is_leader'] ? $team['user_id'] : -1,
					"projects_user_id" => $team['user_is_leader'] ? $team['projects_user_id'] : -1,
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

	jsonResponse($res, 200);
}

function get_tinder()
{
	$res = array();

	$userProjects = getTinderUserProjects();
	$userProjectScore = getProjectsCount();
	$userExamScore = getExamCount();


	$userDoneProjects = array();

	foreach ($userProjects as $project) {
		if ($project["is_locked"] >= 1) {

			if (isset($userDoneProjects[$project["user_id"]])) {
				array_push($userDoneProjects[$project["user_id"]]["projects"], $project["project_slug"]);
			} else {
				$userDoneProjects[$project["user_id"]] = array(
					"user_id" => $project["user_id"],
					"login" => $project["login"],
					"avatar_url" => $project["avatar_url"],
					"projects" => array($project["project_slug"]),
					"score" => 0
				);
				;
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
			$userDoneProjects[$score["user_id"]]["score"] += $score["validated"] * 0.5;
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
				} else {
					$score = map($user["score"], $filter["min"], $filter["max"], 100, 200);
				}
				if ($score > 200) {
					continue;
				}

				array_push(
					$tmp[$filter_key],
					array(

						"user_id" => $user["user_id"],
						"login" => $user["login"],
						"avatar_url" => $user["avatar_url"],
						"score" => $score
					)
				);
			}
		}
	}

	$res = array();

	$res["filters"] = $filters;
	$res["values"] = $tmp;


	jsonResponse($res, 200);

}



function get_subjects($filter = "all")
{
	$tmp = array();
	$res = array();

	$subjects = getSubjectsHeads();

	foreach ($subjects as $subject) {

		if ($filter == "matched" && $subject['project_slug'] == null) {
			continue;
		} else if ($filter == "unmatched" && $subject['project_slug'] != null) {
			continue;
		}

		if (!isset($tmp[$subject['id']])) {
			$tmp[$subject['id']] = array(
				'id' => $subject['id'],
				'title' => $subject['title'],
				'title_hash' => $subject['title_hash'],
				'project_slug' => $subject['project_slug'],
				'subjects' => array(),
			);
		}

		array_push(
			$tmp[$subject['id']]['subjects'],
			array(
				'id' => $subject['subject_id'],
				'url' => $subject['subject_url'],
				'date' => $subject['subject_date'],
			)
		);
	}

	$res["columns"] = array(
		array("label" => "Id", "field" => "id"),
		array("label" => "Title", "field" => "title"),
		array("label" => "Title hash", "field" => "title_hash"),
		array("label" => "Project", "field" => "project_slug"),
		array("label" => "Details", "field" => "details"),
	);

	$res["values"] = array_values($tmp);

	jsonResponse($res, 200);
}

function get_xp_info($user_id)
{

	$tmp = getCursus21Projects();

	$res = array();

	$res['projects'] = $tmp;
	$res['myprojects'] = getSingleUserTeams($user_id);
	$res['cursusinfo'] = getUserInfos($user_id);


	jsonResponse($res, 200);
}

