<?php


//Request given user's password and verify it
function loginUser($login, $password, $checkPassword = true)
{
  $query = "SELECT id, login, password FROM login_users WHERE login = :login";
  $data = array(":login" => $login);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  if (count($result) === 1) {
    $result = $result[0];

    if ($checkPassword) {
      if ($result["password"] != null) {
        return (password_verify($password, $result["password"]));
      }
      else {
        return false;
      }
    }

    return true;
  }

  return false;
}



//Get user informations for session storage, (username, join date, score)
function getUserInfos($login)
{
  $query = "SELECT login_users.id, login_users.login, 
  login_users.display_name, login_users.avatar_url,
  themes.id AS theme_id, themes.image AS theme_image, 
  login_user_profiles.css_click AS css_click, 
  login_user_profiles.color AS theme_color, login_user_profiles.terms,
  login_user_profiles.citation AS citation, login_user_profiles.citation_avatar AS citation_avatar
  FROM login_users
  
  JOIN login_user_profiles ON login_user_profiles.id = login_users.id
  JOIN themes ON themes.id = login_user_profiles.theme_id

  WHERE login = :login
  ";

  $data = array(":login" => $login);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  if (count($result) === 1) {
    $result = $result[0];

    return array(
      "id" => $result["id"],
      "login" => $result["login"],
      "display_name" => $result["display_name"],
      "avatar_url" => $result["avatar_url"],

      "css_click" => $result["css_click"],
      
      "theme_id" => $result["theme_id"],
      "theme_image" => $result["theme_image"],
      "theme_color" => $result["theme_color"],
      "terms" => $result["terms"],

      "citation" => $result["citation"],
      "citation_avatar" => $result["citation_avatar"]
    );
  }

  return array("error" => "Not found");
}


function createAccount($id, $login, $firstname, $lastname, $displayname, $avatar_url)
{
  $query = "INSERT INTO login_users (id, login, password, first_name, last_name, display_name, avatar_url)
  VALUES (:id, :login, NULL, :first_name, :last_name, :display_name, :avatar_url)";

  $data = array(
    ":id" => $id,
    ":login" => $login,
    ":first_name" => $firstname,
    ":last_name" => $lastname,
    ":display_name" => $displayname,
    ":avatar_url" => $avatar_url,
  );

  $success = executeQueryAction($query, $data);

  $query = "INSERT INTO login_user_profiles (id) VALUES (:id) ON CONFLICT DO NOTHING";
  $data = array(
    ":id" => $id
  );

  $success &= executeQueryAction($query, $data);

  return $success;
}


function updateAccount($id, $login, $firstname, $lastname, $displayname, $avatar_url)
{
  $query = "UPDATE login_users SET 
    first_name = :first_name, 
    last_name = :last_name, 
    display_name = :display_name, 
    avatar_url = :avatar_url
    WHERE id = :id AND login = :login";

  $data = array(
    ":id" => $id,
    ":login" => $login,
    ":first_name" => $firstname,
    ":last_name" => $lastname,
    ":display_name" => $displayname,
    ":avatar_url" => $avatar_url,
  );

  $success = executeQueryAction($query, $data);

  return $success;
}

function upsertUserGroup($id, $login) {
  $query = "SELECT id
  FROM login_groups
  WHERE owner_id = :id";

  $data = array(":id" => $id);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  if (count($result) >= 1) {
    return -1;
  }
  else {
    $query = "INSERT INTO login_groups (id, name, owner_id)
    VALUES (:id, :name, :owner_id)";

    $data = array(
      ":id" => $id,
      ":name" => "sg_".$login,
      ":owner_id" => $id,
    );

    $success = executeQueryAction($query, $data);

    if ($success) {
      $query = "SELECT id
      FROM login_groups
      WHERE owner_id = :id";

      $data = array(":id" => $id);

      require_once("model/dbConnector.php");
      $result = executeQuerySelect($query, $data);

      if (count($result) >= 1) {
        return $result[0]["id"];
      }
      else {
        throw new Exception('User group not found after creation');
      }
    }
    else {
      throw new Exception('User group creation error by zero.');
    }
  }
}

//Add a new user to the database
// function createUser($userEmail, $userName, $userPassword)
// {
//   $query = "SELECT COUNT(id) AS count FROM users WHERE email = :email";
//   $data = array(":email" => $userEmail);

//   require_once("model/dbConnector.php");
//   $emailExist = executeQuerySelect($query, $data);

//   //Stops if user's email already exists
//   if($emailExist[0]["count"] > 0)
//   {
//     // throw new EmailAlreadyExistException();
//   }

//   $hashedPassword = password_hash($userPassword, PASSWORD_BCRYPT);
//   $creationDate = date("Y-m-d");

//   $query = "INSERT INTO users (email, username, password, creationDate)
//   VALUES (:email, :username, :password, :creationDate)";

//   $data = array(":email" => $userEmail, ":username" => $userName,
//   ":password" => $hashedPassword, ":creationDate" => $creationDate);

//   $success = executeQueryAction($query, $data);

//   return $success;
// }
