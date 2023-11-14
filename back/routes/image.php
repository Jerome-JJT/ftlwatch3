<?php



$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

require_once("controller/authorization.php");

need_permission("p_47student");


require_once("controller/image.php");
$selectedFilter = "";

if (isset($_GET["filter"])) {
    $selectedFilter = $_GET["filter"];
}

image_api($selectedFilter);

exit();