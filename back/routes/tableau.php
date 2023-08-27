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




require_once("controller/tableau.php");
$filter = "";
$projects = "";

if (isset($_GET["filter"])) {
    $filter = $_GET["filter"];
}

if (isset($_GET["projects"])) {
    $projects = $_GET["projects"];
}

tableau_api($filter, $projects);

exit();