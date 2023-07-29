<?php

session_start();

// $json = file_get_contents('php://input');
// $data = json_decode($json);
// print_r($data);
// print_r("end<br>");
// print_r($_REQUEST);
// print_r($_SERVER);

$page = "";
if(isset($_GET["page"]))
{
    $page = $_GET["page"];
}

switch($page)
{
    case "login":
        require_once("routes/login.php");
        break;

// case "generateGame":
//   require_once("controler/gameGeneration.php");
//   generateGame($_POST);
//   break;

// case "searchGame":
//   require_once("controler/gameGeneration.php");
//   searchGame($_POST);
//   break;

// case "upload":
//   require_once("controler/uploading.php");
//   uploadTrack($_POST, $_FILES);
//   break;
}