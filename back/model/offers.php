<?php 


function getOffers()
{
  $query = "SELECT id, title, salary, \"address\", 
  valid_at, invalid_at, little_description, big_description, created_at

  FROM offers

  ORDER BY invalid_at DESC";
  $data = array();

  require_once("model/dbConnector.php");
  $points = executeQuerySelect($query, $data);

  return $points;
}
