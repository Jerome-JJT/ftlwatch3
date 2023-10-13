<?php

require_once("controller/authorization.php");
require_once("controller/basic/coalitions.php");
require_once("controller/basic/campus.php");
require_once("controller/basic/products.php");
require_once("controller/basic/titles.php");
require_once("controller/basic/achievements.php");
require_once("controller/basic/groups.php");
require_once("controller/basic/cursus.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

need_permission("p_student");

switch ($action) {
    case "get_coalitions":
        get_coalitions();
        break;

    case "get_campus":
        get_campus();
        break;

    case "get_cursus":
        get_cursus();
        break;

    case "get_products":
        get_products();
        break;

    case "get_titles":
        get_titles();
        break;

    case "get_achievements":
        get_achievements();
        break;

    case "get_groups":
        get_groups();
        break;

}

exit();