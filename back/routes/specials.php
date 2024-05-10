<?php

require_once("controller/specials.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

need_permission("p_logged");


switch ($action) {
    case "tig":
        specials_tig($_SESSION["user"]);
        break;

    case "complain":
        specials_css($_SESSION["user"]);
        break;
}

exit();