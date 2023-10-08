<?php

function getUsersShort()
{
  $query = "SELECT 
  users.id,
  users.login,
  users.avatar_url,
  users.kind,
  users.is_staff,
  users.has_cursus21,
  users.has_cursus9,
  poolfilters.name AS poolfilter,
  users.hidden
  
  FROM users
  JOIN poolfilters ON users.poolfilter_id = poolfilters.id
  ORDER BY login
  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

function getUsers($poolfilter = '')
{
  $query = "SELECT 
  users.id,
  users.login,
  users.first_name,
  users.last_name,
  users.display_name,
  users.avatar_url,
  users.grade,
  users.level,
  users.kind,
  users.is_staff,
  users.nbcursus,
  users.has_cursus21,
  users.has_cursus9,
  poolfilters.name AS poolfilter
  
  FROM users
  JOIN poolfilters ON users.poolfilter_id = poolfilters.id
  WHERE users.hidden = false
  AND (
       (:poolfilter = 'all')
    OR (:poolfilter = 'cursus' AND users.has_cursus21 = TRUE)
    OR (poolfilters.name LIKE CONCAT(:poolfilter,'%'))
    )
  ORDER BY login
  ";

  $data = array(":poolfilter" => $poolfilter);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

function setUser($userId, $value)
{
  $query = "UPDATE users
  SET hidden = :hidden
  WHERE id = :user_id";

  $data = array(":user_id" => $userId, ":hidden" => $value == "true" ? "TRUE" : "FALSE");

  return executeQueryAction($query, $data);
}
