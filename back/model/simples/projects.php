<?php 


function getProjects()
{
  $query = "SELECT projects.id, projects.name, projects.slug, 
  projects.difficulty, projects.is_exam, projects.main_cursus, 
  projects.session_is_solo, projects.session_estimate_time, projects.session_duration_days, projects.session_terminating_after,
  projects.session_description, projects.session_has_moulinette, projects.session_correction_number, projects.session_scale_duration, 
  projects.rule_min, projects.rule_max, projects.rule_retry_delay
  FROM projects
  ORDER BY id";
  $data = array();

  require_once("model/dbConnector.php");
  $campus = executeQuerySelect($query, $data);

  return $campus;
}

