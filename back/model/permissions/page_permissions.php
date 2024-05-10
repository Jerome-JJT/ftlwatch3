<?php




function getPagePermissions()
{
  $query = "SELECT permissions.id, permissions.name 
  FROM permissions
  ORDER BY corder";
  $data = array();

  require_once("model/dbConnector.php");
  $permissions = executeQuerySelect($query, $data);


  $query = "SELECT 
    pages.id, 
    pages.name,
    pages.corder,
    pages.permission_id
    FROM pages";

  $data = array();

  $pages = executeQuerySelect($query, $data);


  return array($pages, $permissions);
}

function setPagePermission($pageId, $permissionId) {

  if ($permissionId == "null") {
    $permissionId = null;
  }

  $query = "UPDATE pages SET permission_id = :permission_id
  WHERE id = :page_id";

  $data = array(":permission_id" => $permissionId, ":page_id" => $pageId);

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}

function setPageOrder($pageId, $corder) {

  $query = "UPDATE pages SET corder = :corder
  WHERE id = :page_id";

  $data = array(":corder" => $corder, ":page_id" => $pageId);

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}
