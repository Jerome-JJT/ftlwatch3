<?php
require_once("controller/_common.php");
require_once("model/offers.php");



function get_offers()
{
    $tmp = getOffers();

    $res = array();

    $res["columns"] = array(
        array("label" => "Title", "field" => "title"),
        array("label" => "Salary", "field" => "salary"),
        array("label" => "Address", "field" => "address"),
        array("label" => "Valid", "field" => "valid_at"),
        array("label" => "Invalid", "field" => "invalid_at"),
        array("label" => "Short", "field" => "little_description"),
        array("label" => "Description", "field" => "big_description"),
    );

    // $tmp = array_map(function ($value) {

    //     return $value;
    // }, $tmp);

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}

