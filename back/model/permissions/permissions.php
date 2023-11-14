<?php



function getUserPermissions($user_id) {
  $query = "SELECT permission_id, permission_name, permission_slug 
    FROM v_login_user_permissions

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
  v_page_menus.subroute
  
  FROM v_page_menus 

  JOIN v_login_user_permissions ON v_login_user_permissions.permission_id = v_page_menus.permission_id

  WHERE v_login_user_permissions.login_user_id = :user_id
  ";
  // WHERE users_groups.user_id = :user_id

  // $data = array(":user_id" => $user_id);
  $data = array(":user_id" => $userId);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  $realResult = array();
  foreach ($result as $elem) {

    $submenu = $elem["submenu_id"];

    // If menu is part of a main menu
    if ($submenu != -1) {
      $flag = false;

      // Add menu in main menu
      foreach ($realResult as &$testResult) {
        if ($testResult["submenu_id"] == $submenu) {

          if ($elem == null || strlen($elem["route"]) == 0) {
            $elem["route"] = $elem["subroute"];
          }
          unset($elem["subname"]);
          unset($elem["subicon"]);
          unset($elem["subroute"]);


          array_push($testResult["list"], $elem);
          $flag = true;
          break;
        }
      }

      // If main menu dont already have an entry
      if ($flag == false) {
        $submenu = $elem;

        if ($elem == null || strlen($elem["route"]) == 0) {
          $elem["route"] = $elem["subroute"];
        }
        unset($elem["subname"]);
        unset($elem["subicon"]);
        unset($elem["subroute"]);


        // $submenu["id"] = "sub_" . $submenu["id"];
        $submenu["name"] = $submenu["subname"];
        $submenu["icon"] = $submenu["subicon"];

        unset($submenu["subname"]);
        unset($submenu["subicon"]);
        unset($submenu["subroute"]);
        unset($submenu["route"]);
        unset($submenu["basefilter"]);

        $submenu["list"] = array($elem);
        array_push($realResult, $submenu);
      }

    } else {
      unset($elem["subname"]);
      unset($elem["subicon"]);
      unset($elem["subroute"]);

      array_push($realResult, $elem);
    }
  }

  return $realResult;
}


