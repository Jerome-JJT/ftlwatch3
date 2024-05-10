<?php

function getThemes() {

  $query = "SELECT id, name, image FROM themes ORDER BY id";

  $data = array();

  require_once("model/dbConnector.php");
  return executeQuerySelect($query, $data);
}


function getBanDate($userId)
{

  $query = "SELECT login_user_profiles.ban_date
  FROM login_user_profiles
  
  WHERE id = :user_id
  ";

  $data = array(":user_id" => $userId);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  if (count($result) === 1) {
    $result = $result[0];

    return array(
      "ban_date" => $result["ban_date"]
    );
  }

  return array("error" => "Not found");
}


function setBanDate($userId, $banDate)
{
  $query = "UPDATE login_user_profiles SET ban_date = :ban_date

  WHERE id = :user_id";

  $data = array(
    ":user_id" => $userId,
    ":ban_date" => $banDate
  );

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}

function getCss($userId)
{

  $query = "SELECT login_user_profiles.css_click
  FROM login_user_profiles
  
  WHERE id = :user_id
  ";

  $data = array(":user_id" => $userId);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  if (count($result) === 1) {
    $result = $result[0];

    return array(
      "css_click" => $result["css_click"]
    );
  }

  return array("error" => "Not found");
}

function setIncrementCss($userId)
{
  $query = "UPDATE login_user_profiles SET css_click = css_click + 1

  WHERE id = :user_id";

  $data = array(
    ":user_id" => $userId
  );

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);

}

function setSettings($userId, $themeId, $themeColor, $terms) {

  $query = "UPDATE login_user_profiles SET 
  
  theme_id = COALESCE(:theme_id, theme_id),
  color = COALESCE(:color, color),
  terms = COALESCE(:terms, terms)

  WHERE id = :userId AND login_user_profiles.can_change_theme = TRUE";

  $data = array(
    ":userId" => $userId,
    ":theme_id" => $themeId,
    ":color" => $themeColor,
    ":terms" => $terms,
  );

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}


function setSettingsAdmin($userId, $themeId, $themeColor, $githubLink, 
$terms, $canChangeTheme, $citation, $citationAvatar) {

  $query = "UPDATE login_user_profiles SET 
  
  theme_id = COALESCE(:theme_id, theme_id),
  color = COALESCE(:color, color),
  github_link = COALESCE(:github_link, github_link),
  terms = COALESCE(:terms, terms),
  can_change_theme = COALESCE(:can_change_theme, can_change_theme),
  citation = COALESCE(:citation, citation),
  citation_avatar = COALESCE(:citation_avatar, citation_avatar)

  WHERE id = :userId";

  $data = array(
    ":userId" => $userId,
    ":theme_id" => $themeId,
    ":color" => $themeColor,
    ":github_link" => $githubLink,
    ":terms" => $terms,
    ":can_change_theme" => $canChangeTheme,
    ":citation" => $citation,
    ":citation_avatar" => $citationAvatar,
  );

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}


function setPassword($userId, $hashedPassword) {

  $query = "UPDATE login_users SET 
  
  password = :password

  WHERE id = :userId";

  $data = array(
    ":userId" => $userId,
    ":password" => $hashedPassword,
  );

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}



function getProfiles()
{
  $query = "SELECT 
  login_users.id AS user_id,
  login_users.login,
  login_users.avatar_url,

  CASE WHEN login_users.password IS NOT NULL 
  THEN TRUE ELSE FALSE END AS password,

  login_user_profiles.theme_id,
  login_user_profiles.color,
  login_user_profiles.can_change_theme,

  login_user_profiles.github_link,
  login_user_profiles.ban_date,
  login_user_profiles.css_click,
  login_user_profiles.ads,
  login_user_profiles.terms,
  login_user_profiles.citation,
  login_user_profiles.citation_avatar
  
  FROM login_users

  JOIN login_user_profiles ON login_user_profiles.id = login_users.id
  JOIN themes ON themes.id = login_user_profiles.theme_id

  ORDER BY login_users.id
  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

