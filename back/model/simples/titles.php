<?php 


function getTitles()
{
  $query = "SELECT titles.id, titles.name
  FROM titles
  ORDER BY id";
  $data = array();

  require_once("model/dbConnector.php");
  $campus = executeQuerySelect($query, $data);

  return $campus;
}

