<?php 


function getPoints()
{
  $query = "SELECT login, 

  COALESCE(SUM(CASE WHEN reason = 'Provided points to the pool.' THEN sum ELSE 0 END), 0) * -1 AS sum_given, 
  COALESCE(AVG(CASE WHEN reason = 'Provided points to the pool.' THEN sum END), 0) * -1 AS avg_given, 
  SUM(CASE WHEN reason = 'Defense plannification' THEN 1 ELSE 0 END) AS eval_plan, 
  SUM(CASE WHEN reason = 'Earning after defense' THEN 1 ELSE 0 END) AS eval_earn

  FROM users
  LEFT JOIN points_transactions ON points_transactions.user_id = users.id

  WHERE users.hidden = FALSE AND login NOT LIKE '3b3-%'

  GROUP BY user_id, login
  ORDER BY sum_given DESC";
  $data = array();

  require_once("model/dbConnector.php");
  $points = executeQuerySelect($query, $data);

  return $points;
}

function getPools()
{
  $query = "SELECT 
  points_transactions.user_id, 
  points_transactions.reason, 
  ABS(points_transactions.sum) AS sum, 
  points_transactions.created_at, 
  CASE WHEN projects.session_scale_duration >= 1800 THEN FLOOR(projects.session_scale_duration / 1800) ELSE 1 END AS price, 
  team_user.user_id AS leader_id, 
  teams.name, 
  projects.slug
  
  FROM points_transactions
  
  LEFT JOIN team_scale ON team_scale.id = points_transactions.scale_team_id
  LEFT JOIN teams ON teams.id = team_scale.team_id
  LEFT JOIN projects ON projects.id = teams.project_id
  
  LEFT JOIN team_user ON team_user.team_id = teams.id
  
  WHERE points_transactions.is_piscine = FALSE
  AND (points_transactions.user_id != 79378 AND points_transactions.user_id != 132333)
  AND points_transactions.created_at > '2021-06-01'
  AND (team_user.is_leader = TRUE OR team_user.is_leader IS NULL)
  
  ORDER BY points_transactions.created_at
  ";
  $data = array();

  require_once("model/dbConnector.php");
  $points = executeQuerySelect($query, $data);

  return $points;
}


function getPoolsOld()
{
  $query = "SELECT reason, sum, created_at
  FROM points_transactions
  WHERE (reason LIKE '%sales%' OR reason LIKE '%pool%') 
  AND created_at > '2021-01-01' 
  AND (user_id != 79378 AND user_id != 132333)
  ORDER BY created_at
  ";
  $data = array();

  require_once("model/dbConnector.php");
  $points = executeQuerySelect($query, $data);

  return $points;
}

