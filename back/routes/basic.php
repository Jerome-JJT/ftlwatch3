<?php

require_once("controller/authorization.php");

require_once("controller/basic/achievements.php");
require_once("controller/basic/campus.php");
require_once("controller/basic/coalitions.php");
require_once("controller/basic/cursus.php");
require_once("controller/basic/groups.php");
require_once("controller/basic/products.php");
require_once("controller/basic/projects.php");
require_once("controller/basic/rules.php");
require_once("controller/basic/titles.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

need_permission("p_logged");

switch ($action) {
    
    case "get_achievements":
        get_achievements();
        break;
        
    case "get_campus":
        get_campus();
        break;
        
    case "get_coalitions":
        get_coalitions();
        break;

    case "get_cursus":
        get_cursus();
        break;
    
    case "get_groups":
        get_groups();
        break;
                    
    case "get_products":
        get_products();
        break;
        
    case "get_projects":
        get_projects();
        break;
        
    case "get_rules":
        get_rules();
        break;

    case "get_titles":
        get_titles();
        break;

}

exit();