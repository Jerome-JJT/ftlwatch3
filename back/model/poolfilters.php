<?php


function getPoolFilters($hidden)
{
  $query = "SELECT id, name, hidden FROM poolfilters
  WHERE hidden = false OR hidden = :hidden";

  $data = array(":hidden" => $hidden ? "TRUE" : "FALSE");

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}


function setPoolFilter($poolfilterId, $value)
{
  $query = "UPDATE poolfilters
  SET hidden = :hidden
  WHERE id = :poolfilter_id";

  $data = array(":poolfilter_id" => $poolfilterId, ":hidden" => $value == "true" ? "TRUE" : "FALSE");

  return executeQueryAction($query, $data);
}
