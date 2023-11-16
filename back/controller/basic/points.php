<?php
require_once("controller/_common.php");
require_once("model/simples/points.php");



function get_points()
{
    $tmp = getPoints();

    $res = array();

    $res["columns"] = array(
        array("label" => "Login", "field" => "login"),
        array("label" => "Given to pool", "field" => "sum_given"),
        array("label" => "Average given to pool", "field" => "avg_given"),
        array("label" => "Nb as evaluated", "field" => "eval_plan"),
        array("label" => "Nb as evaluator", "field" => "eval_earn"),
    );

    $tmp = array_map(function ($value) {
        $value["avg_given"] = round($value["avg_given"], 2);

        return $value;
    }, $tmp);

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}
