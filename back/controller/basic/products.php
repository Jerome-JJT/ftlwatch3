<?php
require_once("controller/_common.php");
require_once("model/simples/products.php");



function get_products()
{
    $tmp = getProducts();

    $res = array();

    // $res["columns"] = array_merge(
    //     array(array("label" => "Login", "field" => "login")),
    //     array_map(function ($value) {
    //         return array("label" => $value["name"], "field" => $value["id"]);
    //     }, $tmp[0])
    // );

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}
