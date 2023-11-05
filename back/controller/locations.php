<?php
require_once("controller/_common.php");
require_once("model/locations.php");



function get_users_computers()
{
    $usersComputers = getUsersComputers();


    $tmp = array();

    foreach ($usersComputers as $userRank) {
        if (!isset($tmp[$userRank["login"]])) {
            $tmp[$userRank["login"]] = array("login" => $userRank["login"]);
        }

        $tmp[$userRank["login"]]["rank_".$userRank["rank"]."_score"] = round($userRank["total_length"] / 3600, 2);
        $tmp[$userRank["login"]]["rank_".$userRank["rank"]."_host"] = $userRank["host"];
    }
    
    
    $res = array();
    $res["values"] = array_values($tmp);

    $res["columns"] = [
        ["label" => "Login", "field" => "login"]
    ];

    for ($i = 1; $i <= 10; $i++) {
        array_push($res["columns"], ["label" => $i." host", "field" => "rank_".$i."_host"]);
        array_push($res["columns"], ["label" => $i." score", "field" => "rank_".$i."_score"]);
    }

    jsonResponse($res, 200);
}


function get_users_totals()
{

    $res = array();

    $tmp = getUsersTotals();

    $tmp = array_map(function ($value) {
        $total = $value["total"];
        $value["total"] = round($total / 3600, 2);
        $value["total_piscine"] = round($value["total_piscine"] / 3600, 2);

        $value["entries"] = $value["entries"];
        $value["average"] = round($value["average"] / 3600, 2);

        $value["_total_sun"] = round(($value["total_sun"] / $total) * 100, 2);
        $value["total_sun"] = $value["_total_sun"]." %";
        $value["_total_moon"] = round(($value["total_moon"] / $total) * 100, 2);
        $value["total_moon"] = $value["_total_moon"]." %";

        $value["_total_c1"] = round(($value["total_c1"] / $total) * 100, 2);
        $value["total_c1"] = $value["_total_c1"]." %";
        $value["_total_c2"] = round(($value["total_c2"] / $total) * 100, 2);
        $value["total_c2"] = $value["_total_c2"]." %";
        $value["_total_c3"] = round(($value["total_c3"] / $total) * 100, 2);
        $value["total_c3"] = $value["_total_c3"]." %";

        return $value;
    }, $tmp);

    $res["values"] = $tmp;

    $res["columns"] = [
        ["label" => "Login", "field" => "login"],
        ["label" => "Total hours", "field" => "total"],
        ["label" => "Total piscine hours", "field" => "total_piscine"],

        ["label" => "Total entries", "field" => "entries"],
        ["label" => "Average hours by log", "field" => "average"],

        ["label" => "Total sun", "field" => "total_sun"],
        ["label" => "Total moon", "field" => "total_moon"],

        ["label" => "Total Gotham", "field" => "total_c1"],
        ["label" => "Total Asgard", "field" => "total_c2"],
        ["label" => "Total SSD", "field" => "total_c3"],
    ];

    jsonResponse($res, 200);

}



