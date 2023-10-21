<?php

function getThemes() {

  $query = "SELECT id, name, image FROM themes ORDER BY id";

  $data = array();

  require_once("model/dbConnector.php");
  return executeQuerySelect($query, $data);
}



function setSettings($userId, $themeValue, $themeColor, $terms) {

  $query = "UPDATE login_user_profiles SET 
  
  theme_id = COALESCE(:theme_id, theme_id),
  color = COALESCE(:color, color),
  terms = COALESCE(:terms, terms)

  WHERE id = :userId";

  $data = array(
    ":userId" => $userId,
    ":theme_id" => $themeValue,
    ":color" => $themeColor,
    ":terms" => $terms,
  );

  require_once("model/dbConnector.php");
  return executeQueryAction($query, $data);
}

