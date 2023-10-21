<?php 


function getCoalitions()
{
  $query = "SELECT coalitions.id, coalitions.name, coalitions.slug, 
  coalitions.image_url, coalitions.cover_url, coalitions.color,
  campus.name AS campus_name, cursus.name AS cursus_name
  FROM coalitions
  LEFT JOIN campus ON campus.id = coalitions.campus_id
  LEFT JOIN cursus ON cursus.id = coalitions.cursus_id
  ORDER BY bloc_id";
  $data = array();

  require_once("model/dbConnector.php");
  $coalitions = executeQuerySelect($query, $data);

  return $coalitions;
}

