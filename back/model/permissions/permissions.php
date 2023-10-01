<?php



function getUserPermissions($user_id) {
  $query = "SELECT permission_id, permission_name, permission_slug 
    FROM v_user_permissions

    WHERE login_users_id = :user_id
  ";

  $data = array(":user_id" => $user_id);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}


function getUserPages($user_id)
{
  $query = "SELECT pages.id, pages.name, 
  COALESCE(pages.icon, submenus.icon) AS icon,
  COALESCE(pages.route, submenus.route) AS route, pages.basefilter, 
  COALESCE(submenus.id, -1) AS submenu_id, 
  submenus.name AS subname, submenus.icon AS subicon FROM pages 
  LEFT JOIN submenus ON pages.submenu_id = submenus.id

  ORDER BY submenus.corder, pages.corder
  ";
  // WHERE users_groups.user_id = :user_id

  // $data = array(":user_id" => $user_id);
  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  // jsonlogger('asd', $result, LOGGER_DEBUG());

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


