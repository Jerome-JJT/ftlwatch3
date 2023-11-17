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

  WHERE users.hidden = FALSE

  GROUP BY user_id, login
  ORDER BY sum_given DESC";
  $data = array();

  require_once("model/dbConnector.php");
  $achievements = executeQuerySelect($query, $data);

  return $achievements;
}

