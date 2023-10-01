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

  $columns = array(
    array("id" => "name", "name" => "Name"),
    array("id" => "corder", "name" => "corder"),
    array("id" => "permission", "name" => "Permission")
  );

  return array($columns, $pages, $permissions);
}

function setPagePermission($pageId, $permissionId) {


  $query = "UPDATE pages SET permission_id = :permission_id
  WHERE id = :page_id";

  $data = array(":permission_id" => $permissionId, ":page_id" => $pageId);

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}

// function setUserGroup($userId, $groupId, $value)
// {
//   $query = "SELECT id FROM groups_login_users
//   WHERE login_user_id = :user_id AND group_id = :group_id";

//   $data = array(":user_id" => $userId, ":group_id" => $groupId);

//   require_once("model/dbConnector.php");
//   $user_group = executeQuerySelect($query, $data);

//   if (count($user_group) >= 1 && $value == 'false') {

//     $query = "DELETE FROM groups_login_users
//     WHERE login_user_id = :user_id AND group_id = :group_id";

//     $data = array(":user_id" => $userId, ":group_id" => $groupId);

//     return executeQueryAction($query, $data);
//   }
//   else if (count($user_group) == 0 && $value == 'true') {

//     $query = "INSERT INTO groups_login_users (login_user_id, group_id)
//     VALUES (:user_id, :group_id)";

//     $data = array(":user_id" => $userId, ":group_id" => $groupId);

//     return executeQueryAction($query, $data);
//   }
//   else {
//     return false;
//   }

//   return true;
// }