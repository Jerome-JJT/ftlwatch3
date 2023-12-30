<?php 


function getPoints()
{
  $query = "SELECT users.login, 

  COALESCE(SUM(CASE WHEN points_transactions.reason = 'Provided points to the pool.' THEN sum ELSE 0 END), 0) * -1 AS sum_given, 
  COALESCE(AVG(CASE WHEN points_transactions.reason = 'Provided points to the pool.' THEN sum END), 0) * -1 AS avg_given, 
  SUM(CASE WHEN (points_transactions.reason = 'Defense plannification' AND (projects.main_cursus IS NULL OR projects.main_cursus != 9)) THEN 1 ELSE 0 END) AS eval_plan_cursus,
  SUM(CASE WHEN (points_transactions.reason = 'Earning after defense' AND (projects.main_cursus IS NULL OR projects.main_cursus != 9)) THEN 1 ELSE 0 END) AS eval_earn_cursus,
  SUM(CASE WHEN (points_transactions.reason = 'Defense plannification' AND (projects.main_cursus IS NULL OR projects.main_cursus = 9)) THEN 1 ELSE 0 END) AS eval_plan_pool,
  SUM(CASE WHEN (points_transactions.reason = 'Earning after defense' AND (projects.main_cursus IS NULL OR projects.main_cursus = 9)) THEN 1 ELSE 0 END) AS eval_earn_pool

  FROM users
  LEFT JOIN points_transactions ON points_transactions.user_id = users.id
  LEFT JOIN team_scale ON team_scale.id = points_transactions.scale_team_id
  LEFT JOIN teams ON teams.id = team_scale.team_id
  LEFT JOIN projects ON projects.id = teams.project_id

  WHERE users.hidden = FALSE AND users.login NOT LIKE '3b3-%'

  GROUP BY points_transactions.user_id, users.login
  ORDER BY sum_given DESC";
  $data = array();

  require_once("model/dbConnector.php");
  $achievements = executeQuerySelect($query, $data);

  return $achievements;
}

