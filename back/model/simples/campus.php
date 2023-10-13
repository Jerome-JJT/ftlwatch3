<?php 


function getCampus()
{
  $query = "SELECT campus.id, campus.name, campus.timezone, 
  campus.country, campus.city, campus.address,
  campus.website, campus.users_count
  FROM campus
  ORDER BY id";
  $data = array();

  require_once("model/dbConnector.php");
  $campus = executeQuerySelect($query, $data);

  return $campus;
}

