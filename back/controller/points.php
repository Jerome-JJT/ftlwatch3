<?php
require_once("controller/_common.php");
require_once("model/points.php");



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


function get_pools()
{
    $transactions = getPools();

    $res = array(
        array(
            "fillPoints" => 0,
            "salesPoints" => 0,
            "startFill" => '',
            "endFill" => '',
            "startSales" => '',
            "endSales" => '',
        )
    );


    $fillReasons = array('Defense plannification', 'Provided points to the pool.');
    $salesReasons = array('Earning after defense', 'Refund during sales');

    $currentPool = 0;
    $currentSales = 0;

    $salesDoesEnd = 10;


    foreach($transactions as $tr) {

        if ($tr['reason'] == 'Defense plannification' && ($tr['user_id'] == $tr['leader_id'] || $tr['slug'] == null)) {
            continue;
        }
        if ($tr['reason'] == 'Earning after defense' && ($tr['sum'] == $tr['price'] || $tr['slug'] == null)) {
            continue;
        }

        // print_r($tr);
        // print_r("<br>");
        // print_r($currentPool);
        // print_r($res[$currentPool]);
        // print_r("<br>");
        // print_r($currentSales);
        // print_r($res[$currentSales]);
        // print_r("<br><br>");
        // mylogger($res[$currentSales]['endSales']." ".$tr['created_at']." ".$lastSaleMove->diff($thisMove)->days, LOGGER_DEBUG());


        if ($currentPool != $currentSales && in_array($tr['reason'], $fillReasons)) {

            $lastSaleMove = new DateTime($res[$currentSales]['endSales']);
            $thisMove = new DateTime($tr['created_at']);

            // print_r("<hr>");
            // print_r($res[$currentSales]['endSales']);
            // print_r("<br>");
            // print_r($tr['created_at']);
            // print_r("<br>");
            // print_r("<hr>");
            // print_r("<br>");
            
            // mylogger($res[$currentSales]['endSales']." ".$tr['created_at']." ".$lastSaleMove->diff($thisMove)->days, LOGGER_DEBUG());

            if ($lastSaleMove->diff($thisMove)->days >= 2) {
                $currentSales += 1;
            }
        }

        if ($tr['reason'] == 'Provided points to the pool.' || $tr['reason'] == 'Defense plannification' || $tr['reason'] == 'Evaluator cancelled a defense') {

            if ($res[$currentPool]['startFill'] == '') {
                $res[$currentPool]['startFill'] = $tr['created_at'];
            }
            $res[$currentPool]['endFill'] = $tr['created_at'];
            $res[$currentPool]['fillPoints'] += $tr['sum'];
        }


        if ($currentPool == $currentSales && in_array($tr['reason'], $salesReasons)) {

            $currentPool += 1;

            $res[$currentPool] = array(
                "fillPoints" => 0,
                "salesPoints" => 0,
                "startFill" => '',
                "endFill" => '',
                "startSales" => '',
                "endSales" => '',
            );
            $res[$currentSales]['startSales'] = $tr['created_at'];
        }

        if ($tr['reason'] == 'Earning after defense') {
            $res[$currentSales]['endSales'] = $tr['created_at'];
            $res[$currentSales]['salesPoints'] += ($tr['sum'] - $tr['price']);
        }
        if ($tr['reason'] == 'Refund during sales') {
            $res[$currentSales]['endSales'] = $tr['created_at'];
            $res[$currentSales]['salesPoints'] += $tr['sum'];
        }

    }






    // $res = array();

    // $res["columns"] = array(
    //     array("label" => "Login", "field" => "login"),
    //     array("label" => "Given to pool", "field" => "sum_given"),
    //     array("label" => "Average given to pool", "field" => "avg_given"),
    //     array("label" => "Nb as evaluated", "field" => "eval_plan"),
    //     array("label" => "Nb as evaluator", "field" => "eval_earn"),
    // );

    // $tmp = array_map(function ($value) {
    //     $value["avg_given"] = round($value["avg_given"], 2);

    //     return $value;
    // }, $tmp);

    // $res['values'] = $tmp;

    jsonResponse($res, 200);
}
