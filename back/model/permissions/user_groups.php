<?php



function setUserGroupBySlugs($userId, $groupsSlugs)
{
  $query = "SELECT id, slug FROM groups";

  $data = array();

  require_once("model/dbConnector.php");
  $groups = executeQuerySelect($query, $data);

  // jsonLogger('affasf', $groups, LOGGER_DEBUG());

  $groups = array_filter($groups, function ($v) use($groupsSlugs) { return in_array($v["slug"], $groupsSlugs); });


  $query = "INSERT INTO groups_login_users (login_user_id, group_id)
  VALUES (:user_id, :group_id)";

  $newdata = array_map(function ($v) use($userId) {return array(":user_id" => $userId, ":group_id" => $v);}, array_column($groups, "id"));
  // jsonLogger('affasf', $newdata, LOGGER_DEBUG());

  return executeQueryAction($query, $newdata, true);
}

function getUserGroups()
{
  $query = "SELECT groups.id, groups.name 
  FROM groups
  WHERE groups.owner_id IS NULL
  ORDER BY corder";
  $data = array();

  require_once("model/dbConnector.php");
  $groups = executeQuerySelect($query, $data);
  $group_ids = array_fill_keys(array_column($groups, "id"), false);


  $query = "SELECT 
    login_users.id, 
    login_users.login, 
    groups.id AS group_id
    FROM login_users 
    
    LEFT JOIN groups_login_users ON groups_login_users.login_user_id = login_users.id
    LEFT JOIN groups ON groups.id = groups_login_users.group_id
    
    WHERE groups.owner_id IS NULL";

  $data = array();

  require_once("model/dbConnector.php");
  $users = executeQuerySelect($query, $data);


  $users_groups = array();

  foreach (array_unique(array_column($users, 'id')) as $user) {
    $users_groups[$user] = $group_ids;
  }

  foreach ($users as $user) {
    $users_groups[$user['id']]['id'] = $user['id'];
    $users_groups[$user['id']]['login'] = $user['login'];
    if ($user['group_id'] != null) {
      $users_groups[$user['id']][$user['group_id']] = true;
    }
  }


  return array($groups, array_values($users_groups));
}

function setUserGroup($userId, $groupId, $value)
{
  $query = "SELECT id FROM groups_login_users
  WHERE login_user_id = :user_id AND group_id = :group_id";

  $data = array(":user_id" => $userId, ":group_id" => $groupId);

  require_once("model/dbConnector.php");
  $user_group = executeQuerySelect($query, $data);

  if (count($user_group) >= 1 && $value == 'false') {

    $query = "DELETE FROM groups_login_users
    WHERE login_user_id = :user_id AND group_id = :group_id";

    $data = array(":user_id" => $userId, ":group_id" => $groupId);

    return executeQueryAction($query, $data);
  }
  else if (count($user_group) == 0 && $value == 'true') {

    $query = "INSERT INTO groups_login_users (login_user_id, group_id)
    VALUES (:user_id, :group_id)";

    $data = array(":user_id" => $userId, ":group_id" => $groupId);

    return executeQueryAction($query, $data);
  }
  else {
    return false;
  }

  return true;
}