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
        array("label" => "Nb as evaluated cursus", "field" => "eval_plan_cursus"),
        array("label" => "Nb as evaluator cursus", "field" => "eval_earn_cursus"),
        array("label" => "Nb as evaluated piscine", "field" => "eval_plan_pool"),
        array("label" => "Nb as evaluator piscine", "field" => "eval_earn_pool"),
    );

    $tmp = array_map(function ($value) {
        $value["avg_given"] = round($value["avg_given"], 2);

        return $value;
    }, $tmp);

    $res['values'] = $tmp;

    jsonResponse($res, 200);
}
