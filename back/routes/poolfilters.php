<?php

require_once("controller/_common.php");
require_once("controller/poolfilters.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}


need_permission("p_47student");

jsonResponse(array(), 404);

exit();