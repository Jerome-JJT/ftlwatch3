<?php


function getPoolFilters($hidden)
{
  $query = "SELECT id, name, hidden FROM poolfilters";

  $data = array();

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
  AND (:poolfilter = '' OR poolfilters.name = :poolfilter) 
  ";

  $data = array(":poolfilter" => $poolfilter);
  // $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}