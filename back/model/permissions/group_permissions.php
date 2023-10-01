<?php 


function getGroupPerms()
{
  $query = "SELECT permissions.id, permissions.name FROM permissions
  ORDER BY corder";
  $data = array();

  require_once("model/dbConnector.php");
  $perms = executeQuerySelect($query, $data);
  $perms_ids = array_fill_keys(array_column($perms, "id"), false);


  $query = "SELECT 
      groups.id, 
      groups.name, 
      permissions.id AS permission_id
      FROM groups 
      
      LEFT JOIN groups_permissions ON groups_permissions.group_id = groups.id
      LEFT JOIN permissions ON permissions.id = groups_permissions.permission_id";

  $data = array();

  require_once("model/dbConnector.php");
  $groups = executeQuerySelect($query, $data);

  // jsonLogger('', $groups, LOGGER_DEBUG());

  $groups_perms = array();

  foreach (array_unique(array_column($groups, 'id')) as $group) {
    $groups_perms[$group] = $perms_ids;
  }

  foreach ($groups as $group) {
    $groups_perms[$group['id']]['id'] = $group['id'];
    $groups_perms[$group['id']]['name'] = $group['name'];
    if ($group['permission_id'] != null) {
      $groups_perms[$group['id']][$group['permission_id']] = true;
    }
  }

  return array($perms, array_values($groups_perms));
}


function setGroupPerm($groupId, $permId, $value)
{
  $query = "SELECT id FROM groups_permissions
  WHERE group_id = :group_id AND permission_id = :perm_id";

  $data = array(":group_id" => $groupId, ":perm_id" => $permId);

  require_once("model/dbConnector.php");
  $group_perm = executeQuerySelect($query, $data);

  if (count($group_perm) >= 1 && $value == 'false') {

    $query = "DELETE FROM groups_permissions
    WHERE group_id = :group_id AND permission_id = :permission_id";

    $data = array(":group_id" => $groupId, ":permission_id" => $permId);

    return executeQueryAction($query, $data);
  }
  else if (count($group_perm) == 0 && $value == 'true') {

    $query = "INSERT INTO groups_permissions (group_id, permission_id)
    VALUES (:group_id, :permission_id)";

    $data = array(":group_id" => $groupId, ":permission_id" => $permId);

    return executeQueryAction($query, $data);
  }
  else {
    return false;
  }

  return true;
}

