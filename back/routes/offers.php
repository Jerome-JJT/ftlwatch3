<?php

require_once("controller/offers.php");

$action = "";
if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

need_permission("p_logged");

switch ($action) {
    case "get_offers":
        get_offers();
        break;
}

exit();