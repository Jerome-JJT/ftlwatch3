<?php


function getUserPages($user_id)
{
  $query = "SELECT pages.id, pages.name, 
  COALESCE(pages.icon, submenus.icon) AS icon,
  COALESCE(pages.route, submenus.route) AS route, pages.basefilter, 
  COALESCE(submenus.id, -1) AS submenu_id, 
  submenus.name AS subname, submenus.icon AS subicon FROM pages 
  LEFT JOIN submenus ON pages.submenu_id = submenus.id

  ORDER BY submenus.order, pages.order
  ";
  // WHERE users_groups.user_id = :user_id

  // $data = array(":user_id" => $user_id);
  $data = array();
  //   print_r($query);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);


  $realResult = array();
  foreach ($result as $elem) {

    $submenu = $elem["submenu_id"];

    if ($submenu != -1) {
      $flag = false;

      foreach ($realResult as &$testResult) {
        if ($testResult["submenu_id"] == $submenu) {

          unset($elem["subname"]);
          unset($elem["subicon"]);

          array_push($testResult["list"], $elem);
          $flag = true;
          break;
        }
      }

      if ($flag == false) {
        $submenu = $elem;

        unset($elem["subname"]);
        unset($elem["subicon"]);

        // $submenu["id"] = "sub_" . $submenu["id"];
        $submenu["name"] = $submenu["subname"];
        $submenu["icon"] = $submenu["subicon"];

        unset($submenu["subname"]);
        unset($submenu["subicon"]);
        unset($submenu["basefilter"]);

        $submenu["list"] = array($elem);
        array_push($realResult, $submenu);
      }

    } else {
      unset($elem["subname"]);
      unset($elem["subicon"]);

      array_push($realResult, $elem);
    }
  }

  return $realResult;
}


function getUserGroups()
{
  $query = "SELECT groups.id, groups.name FROM groups";

  // $data = array(":user_id" => $user_id);
  $data = array();
  //   print_r($query);

  require_once("model/dbConnector.php");
  $groups = executeQuerySelect($query, $data);
  // $group_names = array_map(function ($value) { return false; }, array_flip(array_column($groups, $name)));
  $group_ids = array_fill_keys(array_column($groups, "id"), false);


  $query = "SELECT 
    login_users.id, 
    login_users.login, 
    groups.id AS group_id, 
    groups.name AS group_name 
    FROM login_users 
    
    LEFT JOIN groups_login_users ON groups_login_users.login_user_id = login_users.id
    LEFT JOIN groups ON groups.id = groups_login_users.group_id";

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

function setUserGroup($userId, $permId, $value)
{
  // $query = "SELECT groups.id, groups.name FROM groups";

  // // $data = array(":user_id" => $user_id);
  // $data = array();
  // //   print_r($query);

  // require_once("model/dbConnector.php");
  // $groups = executeQuerySelect($query, $data);
  // // $group_names = array_map(function ($value) { return false; }, array_flip(array_column($groups, $name)));
  // $group_ids = array_fill_keys(array_column($groups, "id"), false);


  // $query = "SELECT 
  //   login_users.id, 
  //   login_users.login, 
  //   groups.id AS group_id, 
  //   groups.name AS group_name 
  //   FROM login_users 

  //   LEFT JOIN groups_login_users ON groups_login_users.login_user_id = login_users.id
  //   LEFT JOIN groups ON groups.id = groups_login_users.group_id";

  // $data = array();

  // require_once("model/dbConnector.php");
  // $users = executeQuerySelect($query, $data);


  // $users_groups = array();

  // foreach (array_unique(array_column($users, 'id')) as $user) {
  //   $users_groups[$user] = $group_ids;
  // }

  // foreach ($users as $user) {
  //   $users_groups[$user['id']]['id'] = $user['id'];
  //   $users_groups[$user['id']]['login'] = $user['login'];
  //   if ($user['group_id'] != null) {
  //     $users_groups[$user['id']][$user['group_id']] = true;
  //   }
  // }

  return true;
  // return array($groups, array_values($users_groups));
}

function needOnePermission($perms)
{

  return true;

  // $query = "SELECT permissions.id, permissions.name, users_groups FROM permissions 
  // JOIN groups_permissions ON permissions.id = groups_permissions.permission_id
  // JOIN groups ON groups_permissions.group_id = groups.id
  // JOIN users_groups ON groups.id = users_groups.group_id
  // JOIN users ON users_groups.user_id = users.id

  // WHERE users_groups.user_id = :user_id";

  // $data = array(":user_id" => $user_id);
  // //   print_r($query);

  // require_once("model/dbConnector.php");
  // $result = executeQuerySelect($query, $data);

  // if (count($result) === 1) {
  //   $result = $result[0];

  //   if ($checkPassword) {
  //     return (password_verify($password, $result["password"]));
  //   }

  //   return true;
  // }

  // return false;
}




// //Request given user's password and verify it
// function has_permission($login, $password, $checkPassword = true)
// {
//   $query = "SELECT id, login, password FROM login_users WHERE login = :login";
//   $data = array(":login" => $login);
//   //   print_r($query);

//   require_once("model/dbConnector.php");
//   $result = executeQuerySelect($query, $data);

//   if (count($result) === 1) {
//     $result = $result[0];

//     if ($checkPassword) {
//       return (password_verify($password, $result["password"]));
//     }

//     return true;
//   }

//   return false;
// }



// function static_permission($perm_name, $should_have = true)
// {

//   if ($perm_name == "self") {

//   }


//   $query = "SELECT id, login, password FROM login_users WHERE login = :login";
//   $data = array(":login" => $login);
//   //   print_r($query);

//   require_once("model/dbConnector.php");
//   $result = executeQuerySelect($query, $data);

//   if (count($result) === 1) {
//     $result = $result[0];

//     if ($checkPassword) {
//       return (password_verify($password, $result["password"]));
//     }

//     return true;
//   }

//   return false;
// }



// //Get user informations for session storage, (username, join date, score)
// function getUserInfos($login)
// {
//   $query = "SELECT id, login, display_name, avatar_url
//   FROM login_users
//   WHERE login = :login";

//   $data = array(":login" => $login);

//   require_once("model/dbConnector.php");
//   $result = executeQuerySelect($query, $data);

//   if (count($result) === 1) {
//     $result = $result[0];

//     return array(
//       "id" => $result["id"],
//       "login" => $result["login"],
//       "display_name" => $result["display_name"],
//       "avatar_url" => $result["avatar_url"]
//     );
//   }

//   return array("error" => "Not found");
// }

// function createAccount($id, $login, $firstname, $lastname, $displayname, $avatar_url, $color)
// {
//   $query = "INSERT INTO login_users (id, login, password, first_name, last_name, display_name, avatar_url, color)
//   VALUES (:id, :login, NULL, :first_name, :last_name, :display_name, :avatar_url, :color)";

//   $data = array(
//     ":id" => $id,
//     ":login" => $login,
//     ":first_name" => $firstname,
//     ":last_name" => $lastname,
//     ":display_name" => $displayname,
//     ":avatar_url" => $avatar_url,
//     ":color" => $color,
//   );

//   $success = executeQueryAction($query, $data);

//   return $success;
// }


// function updateAccount($id, $login, $firstname, $lastname, $displayname, $avatar_url, $color)
// {
//   $query = "UPDATE login_users SET 
//     first_name = :first_name, 
//     last_name = :last_name, 
//     display_name = :display_name, 
//     avatar_url = :avatar_url, 
//     color =  :color
//     WHERE id = :id AND login = :login";

//   $data = array(
//     ":id" => $id,
//     ":login" => $login,
//     ":first_name" => $firstname,
//     ":last_name" => $lastname,
//     ":display_name" => $displayname,
//     ":avatar_url" => $avatar_url,
//     ":color" => $color,
//   );

//   $success = executeQueryAction($query, $data);

//   return $success;
// }

// //Add a new user to the database
// // function createUser($userEmail, $userName, $userPassword)
// // {
// //   $query = "SELECT COUNT(id) AS count FROM users WHERE email = :email";
// //   $data = array(":email" => $userEmail);

// //   require_once("model/dbConnector.php");
// //   $emailExist = executeQuerySelect($query, $data);

// //   //Stops if user's email already exists
// //   if($emailExist[0]["count"] > 0)
// //   {
// //     // throw new EmailAlreadyExistException();
// //   }

// //   $hashedPassword = password_hash($userPassword, PASSWORD_BCRYPT);
// //   $creationDate = date("Y-m-d");

// //   $query = "INSERT INTO users (email, username, password, creationDate)
// //   VALUES (:email, :username, :password, :creationDate)";

// //   $data = array(":email" => $userEmail, ":username" => $userName,
// //   ":password" => $hashedPassword, ":creationDate" => $creationDate);

// //   $success = executeQueryAction($query, $data);

// //   return $success;
// // }
