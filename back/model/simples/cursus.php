<?php 


function getCursus()
{
  $query = "SELECT cursus.id, cursus.name, cursus.slug, cursus.kind 
  FROM cursus
  ORDER BY id";
  $data = array();

  require_once("model/dbConnector.php");
  $cursus = executeQuerySelect($query, $data);

  return $cursus;
}

