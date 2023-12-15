<?php 


function getProjects()
{
  $query = "SELECT projects.id, projects.name, projects.slug, 
  projects.difficulty, projects.is_exam, projects.main_cursus, projects.has_lausanne, 
  projects.session_id, projects.session_is_solo, projects.session_estimate_time, projects.session_duration_days, projects.session_terminating_after,
  projects.session_description, projects.session_has_moulinette, projects.session_correction_number, projects.session_scale_duration, 
  projects.rule_min, projects.rule_max, projects.rule_retry_delay
  FROM projects
  ORDER BY id";
  $data = array();

  require_once("model/dbConnector.php");
  $projects = executeQuerySelect($query, $data);

  return $projects;
}

function getProject($id)
{
  $query = "SELECT projects.id, projects.name, projects.slug, 
  projects.difficulty, projects.is_exam, projects.main_cursus, projects.has_lausanne, 
  projects.session_id, projects.session_is_solo, projects.session_estimate_time, projects.session_duration_days, projects.session_terminating_after,
  projects.session_description, projects.session_has_moulinette, projects.session_correction_number, projects.session_scale_duration, 
  projects.rule_min, projects.rule_max, projects.rule_retry_delay
  FROM projects
  WHERE id = :id
  ";

  $data = array(":id" => $id);

  require_once("model/dbConnector.php");
  $project = executeQuerySelect($query, $data);

  if (count($project) == 1) {
    return $project[0];
  }

  return null;
}

function getProjectRules($id)
{
  $query = "SELECT rules.id, rules.name, rules.kind, rules.description, rules.slug
  FROM rules
  JOIN project_rules ON project_rules.rule_id = rules.id
  WHERE project_rules.project_id = :id
  ORDER BY id
  ";

  $data = array(":id" => $id);

  require_once("model/dbConnector.php");
  $project_rules = executeQuerySelect($query, $data);

  return $project_rules;
}

function getProjectsVisibility()
{
  $query = "SELECT projects.id, projects.name, projects.slug, 
  projects.main_cursus, projects.corder, projects.project_type_id
  FROM projects
  LEFT JOIN project_types ON project_types.id = projects.project_type_id
  ORDER BY projects.corder";
  $data = array();

  require_once("model/dbConnector.php");
  $projects = executeQuerySelect($query, $data);


  $query = "SELECT 
    project_types.id, 
    project_types.name
    FROM project_types";

  $data = array();

  $project_types = executeQuerySelect($query, $data);

  return array($projects, $project_types);
}

function setProjectOrder($projectId, $corder) {

  $query = "UPDATE projects SET corder = :corder
  WHERE id = :project_id";

  $data = array(":corder" => $corder, ":project_id" => $projectId);

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}

// function setProjectVisibility($projectId, $hidden) {

//   $query = "UPDATE projects SET hidden = :hidden
//   WHERE id = :project_id";

//   $data = array(":project_id" => $projectId, ":hidden" => $hidden == "true" ? "TRUE" : "FALSE");

//   require_once("model/dbConnector.php");
//   return executeQueryAction($query, $data);
// }

function setProjectType($projectId, $typeId) {

  if ($typeId == "null") {
    $typeId = null;
  }

  $query = "UPDATE projects SET project_type_id = :project_type_id
  WHERE id = :project_id";

  $data = array(":project_id" => $projectId, ":project_type_id" => $typeId);

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}

