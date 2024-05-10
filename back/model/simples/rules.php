<?php 


function getRules()
{
  $query = "SELECT rules.id, rules.name, rules.kind, 
  rules.description, rules.slug, rules.internal_name
  FROM rules
  ORDER BY id";
  $data = array();

  require_once("model/dbConnector.php");
  $campus = executeQuerySelect($query, $data);

  return $campus;
}

