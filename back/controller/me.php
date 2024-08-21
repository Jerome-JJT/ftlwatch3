<?php
require_once("model/permissions/permissions.php");
require_once("model/profile.php");
require_once("model/account.php");
require_once("model/projects.php");
require_once("model/users.php");

function me($reload = false)
{

  // mylogger("ME ASKED ".$_SESSION["user"], LOGGER_DEBUG());
  // mylogger("ME ASKED ".implode(" ", array_keys($_SESSION["user"])), LOGGER_DEBUG());
  if (isset($_SESSION["user"])) {

    if ($reload) {
      $_SESSION["user"] = getUserInfos($_SESSION["user"]["login"]);
      $_SESSION["pages"] = getUserPages($_SESSION["user"]["id"]);
    }


    jsonResponse(
      array(
        "user" => $_SESSION["user"],
        "pages" => $_SESSION["pages"]
      ),
      200
    );
  } 
  else {
    jsonResponse(array(), 400);
  }
}

function themes_get()
{
  $res = array();
  $res["themes"] = getThemes();

  jsonResponse($res, 200);
}



function settings_set($data)
{

  if (isset($_SESSION["user"])) {

    $res = setSettings(
      $_SESSION["user"]["id"],
      isset($data["themeValue"]) ? $data["themeValue"] : null,
      isset($data["themeColor"]) ? $data["themeColor"] : null,
      isset($data["terms"]) ? $data["terms"] : null,
    );

    jsonResponse(array(), $res ? 200 : 409);
  }

  jsonResponse(array(), 403);
}


function calculator_get() {

  $res = array(
    "projects" => getCalculatorProjects(),
    "beginLevel" => 0
  );

  if (isset($_SESSION["user"])) {

    $level = getUserXp($_SESSION["user"]["id"]);

    if ($level !== null) {
      $res['beginLevel'] = $level;
    }
  }

  jsonResponse($res, 200);
}