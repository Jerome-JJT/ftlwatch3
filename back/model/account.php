<?php


//Request given user's password and verify it
function loginUser($login, $password, $checkPassword = true)
{
  $query = "SELECT id, login, password FROM login_users WHERE login = :login";
  $data = array(":login" => $login);
  //   print_r($query);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  if (count($result) === 1) {
    $result = $result[0];

    if ($checkPassword) {
      return (password_verify($password, $result["password"]));
    }

    return true;
  }

  return false;
}



//Get user informations for session storage, (username, join date, score)
function getUserInfos($login)
{
  $query = "SELECT id, login, display_name, avatar_url
  FROM login_users
  WHERE login = :login";

  $data = array(":login" => $login);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  if (count($result) === 1) {
    $result = $result[0];

    return array(
      "id" => $result["id"],
      "login" => $result["login"],
      "display_name" => $result["display_name"],
      "avatar_url" => $result["avatar_url"]
    );
  }

  return array("error" => "Not found");
}

function createAccount($id, $login, $firstname, $lastname, $displayname, $avatar_url, $color)
{
  $query = "INSERT INTO login_users (id, login, password, first_name, last_name, display_name, avatar_url, color)
  VALUES (:id, :login, NULL, :first_name, :last_name, :display_name, :avatar_url, :color)";

  $data = array(
    ":id" => $id,
    ":login" => $login,
    ":first_name" => $firstname,
    ":last_name" => $lastname,
    ":display_name" => $displayname,
    ":avatar_url" => $avatar_url,
    ":color" => $color,
  );

  $success = executeQueryAction($query, $data);

  return $success;
}


function updateAccount($id, $login, $firstname, $lastname, $displayname, $avatar_url, $color)
{
  $query = "UPDATE login_users SET 
    first_name = :first_name, 
    last_name = :last_name, 
    display_name = :display_name, 
    avatar_url = :avatar_url, 
    color =  :color
    WHERE id = :id AND login = :login";

  $data = array(
    ":id" => $id,
    ":login" => $login,
    ":first_name" => $firstname,
    ":last_name" => $lastname,
    ":display_name" => $displayname,
    ":avatar_url" => $avatar_url,
    ":color" => $color,
  );

  $success = executeQueryAction($query, $data);

  return $success;
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
