<?php 


function getGroups()
{
  $query = "SELECT groups.id, groups.name
  FROM groups
  ORDER BY id";
  $data = array();

  require_once("model/dbConnector.php");
  $groups = executeQuerySelect($query, $data);

  return $groups;
}

