<?php



$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

// switch ($action) {
//     case "view":
//         require_once("view/login.html");
//         break;
// }

require_once("controller/authorization.php");

need_permission("p_47student");


require_once("controller/tableau.php");
$selectedFilter = "";
$projects = "";

if (isset($_GET["filter"])) {
    $selectedFilter = $_GET["filter"];
}

if (isset($_GET["projects"])) {
    $projects = $_GET["projects"];
}

tableau_api($selectedFilter, $projects);

exit();