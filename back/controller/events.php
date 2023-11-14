<?php
require_once("controller/_common.php");
require_once("model/events.php");



function get_events()
{
    $res = array();

    $events = getEvents();

    $tmp = array();

    foreach ($events as $event) {

        if (!isset($tmp[$event["id"]])) {
            $tmp[$event["id"]] = array(
                "id" => $event["id"], 
                "name" => $event["name"], 
                "description" => $event["description"], 
                "location" => $event["location"], 
                "kind" => $event["kind"], 
                "max_people" => $event["max_people"], 
                "has_cursus21" => $event["has_cursus21"], 
                "has_cursus9" => $event["has_cursus9"],
                "begin_at" => $event["begin_at"], 
                "end_at" => $event["end_at"],
                "users" => array(),
            );
        }

        array_push($tmp[$event["id"]]["users"], $event["login"]);
    }


    $res["values"] = array_values($tmp);

    jsonResponse($res, 200);
}

