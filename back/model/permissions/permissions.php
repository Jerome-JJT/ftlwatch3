<?php



function getUserPermissions($user_id) {
  $query = "SELECT permission_id, permission_name, permission_slug 
    FROM v_user_permissions

    WHERE login_user_id = :user_id
  ";

  $data = array(":user_id" => $user_id);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}


function getUserPages($userId)
{
  $query = "SELECT 
  v_page_menus.id, 
  v_page_menus.name, 
  v_page_menus.icon,
  v_page_menus.route, 
  v_page_menus.basefilter, 
  v_page_menus.submenu_id, 
  v_page_menus.subname, 
  v_page_menus.subicon,
  v_page_menus.permission_id
  
  FROM v_page_menus 

  JOIN v_user_permissions ON v_user_permissions.permission_id = v_page_menus.permission_id

  WHERE v_user_permissions.login_user_id = :user_id
  ";
  // WHERE users_groups.user_id = :user_id

  // $data = array(":user_id" => $user_id);
  $data = array(":user_id" => $userId);

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


