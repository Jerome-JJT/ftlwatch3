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



function get_pools()
{
    $transactions = getPools();

    $tmp = array(
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
        if ($tr['reason'] == 'Earning after defense' && ($tr['sum'] == $tr['cost'] || $tr['slug'] == null)) {
            continue;
        }

        // print_r($tr);
        // print_r("<br>");
        // print_r($currentPool);
        // print_r($tmp[$currentPool]);
        // print_r("<br>");
        // print_r($currentSales);
        // print_r($tmp[$currentSales]);
        // print_r("<br><br>");
        // mylogger($tmp[$currentSales]['endSales']." ".$tr['created_at']." ".$lastSaleMove->diff($thisMove)->days, LOGGER_DEBUG());


        if ($currentPool != $currentSales && in_array($tr['reason'], $fillReasons)) {

            $lastSaleMove = new DateTime($tmp[$currentSales]['endSales']);
            $thisMove = new DateTime($tr['created_at']);

            // print_r("<hr>");
            // print_r($tmp[$currentSales]['endSales']);
            // print_r("<br>");
            // print_r($tr['created_at']);
            // print_r("<br>");
            // print_r("<hr>");
            // print_r("<br>");
            
            // mylogger($tmp[$currentSales]['endSales']." ".$tr['created_at']." ".$lastSaleMove->diff($thisMove)->days, LOGGER_DEBUG());

            if ($lastSaleMove->diff($thisMove)->days >= 2) {
                $currentSales += 1;
            }
        }

        if ($tr['reason'] == 'Provided points to the pool.' || $tr['reason'] == 'Defense plannification' || $tr['reason'] == 'Evaluator cancelled a defense') {

            if ($tmp[$currentPool]['startFill'] == '') {
                $tmp[$currentPool]['startFill'] = $tr['created_at'];
            }
            $tmp[$currentPool]['endFill'] = $tr['created_at'];
            $tmp[$currentPool]['fillPoints'] += $tr['sum'];
        }


        if ($currentPool == $currentSales && in_array($tr['reason'], $salesReasons)) {

            $currentPool += 1;

            $tmp[$currentPool] = array(
                "fillPoints" => 0,
                "salesPoints" => 0,
                "startFill" => '',
                "endFill" => '',
                "startSales" => '',
                "endSales" => '',
            );
            $tmp[$currentSales]['startSales'] = $tr['created_at'];
        }

        if ($tr['reason'] == 'Earning after defense') {
            $tmp[$currentSales]['endSales'] = $tr['created_at'];
            $tmp[$currentSales]['salesPoints'] += ($tr['sum'] - $tr['cost']);
        }
        if ($tr['reason'] == 'Refund during sales') {
            $tmp[$currentSales]['endSales'] = $tr['created_at'];
            $tmp[$currentSales]['salesPoints'] += $tr['sum'];
        }

    }


    $res = array();

    $res["columns"] = [
        ["label" => "Points filled", "field" => "fillPoints"],
        ["label" => "Points saleds", "field" => "salesPoints"],

        ["label" => "Start filling", "field" => "startFill"],
        ["label" => "End filling", "field" => "endFill"],

        ["label" => "Start sales", "field" => "startSales"],
        ["label" => "End sales", "field" => "endSales"]
    ];

    $res["values"] = array_values($tmp);

    jsonResponse($res, 200);
}






function get_pools2()
{

//     $manualPools = array(


// "2021-11-06 08:31:02 +0100",
// "2021-11-08 15:13:35 +0100",

// "2021-12-03 10:02:38 +0100",
// "2021-12-03 19:21:41 +0100",

// "2022-01-09 15:35:46 +0100",
// "2022-01-12 16:45:37 +0100",

// "2022-02-25 17:16:28 +0100",
// "2022-03-02 17:30:16 +0100",

// "2022-05-15 18:14:22 +0200",
// "2022-05-17 14:28:15 +0200",

// "2022-09-15 10:45:05 +0200",
// "2022-09-21 13:20:08 +0200",

// "2022-10-30 15:38:50 +0100",
// "2022-10-31 14:15:31 +0100",

// "2022-11-27 20:42:19 +0100",
// "2022-11-28 20:19:54 +0100",

// "2022-12-17 11:30:19 +0100",
// "2022-12-19 00:39:04 +0100",

// "2023-01-14 21:54:53 +0100",
// "2023-01-16 14:08:11 +0100",

// "2023-02-17 14:49:16 +0100",
// "2023-02-20 13:49:13 +0100",

// "2023-03-14 20:39:43 +0100",
// "2023-03-15 19:58:15 +0100",

// "2023-03-30 16:12:00 +0200",
// "2023-03-31 16:54:57 +0200",

// "2023-04-30 17:32:00 +0200",
// "2023-05-02 17:39:12 +0200",

// "2023-06-03 19:31:29 +0200",
// "2023-06-08 12:53:01 +0200",

// "2023-07-10 13:30:16 +0200",
// "2023-07-16 15:55:12 +0200",

// "2023-08-31 11:33:47 +0200",
// "2023-09-05 17:09:21 +0200",

// "2023-10-15 12:20:05 +0200",
// "2023-10-17 13:15:32 +0200",

// "2023-11-12 15:52:35 +0100",
// "2023-11-13 17:43:32 +0100",

jsonResponse($res, 200);










    // $transactions = getPools();

    // $res = array(
    //     array(
    //         "fillPoints" => 0,
    //         "salesPoints" => 0,
    //         "startFill" => '',
    //         "endFill" => '',
    //         "startSales" => '',
    //         "endSales" => '',
    //     )
    // );


    // $fillReasons = array('Defense plannification', 'Provided points to the pool.');
    // $salesReasons = array('Earning after defense', 'Refund during sales');

    // $currentPool = 0;
    // $currentSales = 0;

    // $salesDoesEnd = 10;


    // foreach($transactions as $tr) {

    //     if ($tr['reason'] == 'Defense plannification' && ($tr['user_id'] == $tr['leader_id'] || $tr['slug'] == null)) {
    //         continue;
    //     }
    //     if ($tr['reason'] == 'Earning after defense' && ($tr['sum'] == $tr['price'] || $tr['slug'] == null)) {
    //         continue;
    //     }


    //     if ($currentPool != $currentSales && in_array($tr['reason'], $fillReasons)) {

    //         $lastSaleMove = new DateTime($res[$currentSales]['endSales']);
    //         $thisMove = new DateTime($tr['created_at']);

    //         if ($lastSaleMove->diff($thisMove)->days >= 2) {
    //             $currentSales += 1;
    //         }
    //     }

    //     if ($tr['reason'] == 'Provided points to the pool.' || $tr['reason'] == 'Defense plannification' || $tr['reason'] == 'Evaluator cancelled a defense') {

    //         if ($res[$currentPool]['startFill'] == '') {
    //             $res[$currentPool]['startFill'] = $tr['created_at'];
    //         }
    //         $res[$currentPool]['endFill'] = $tr['created_at'];
    //         $res[$currentPool]['fillPoints'] += $tr['sum'];
    //     }


    //     if ($currentPool == $currentSales && in_array($tr['reason'], $salesReasons)) {

    //         $currentPool += 1;

    //         $res[$currentPool] = array(
    //             "fillPoints" => 0,
    //             "salesPoints" => 0,
    //             "startFill" => '',
    //             "endFill" => '',
    //             "startSales" => '',
    //             "endSales" => '',
    //         );
    //         $res[$currentSales]['startSales'] = $tr['created_at'];
    //     }

    //     if ($tr['reason'] == 'Earning after defense') {
    //         $res[$currentSales]['endSales'] = $tr['created_at'];
    //         $res[$currentSales]['salesPoints'] += ($tr['sum'] - $tr['price']);
    //     }
    //     if ($tr['reason'] == 'Refund during sales') {
    //         $res[$currentSales]['endSales'] = $tr['created_at'];
    //         $res[$currentSales]['salesPoints'] += $tr['sum'];
    //     }

    // }


    // jsonResponse($res, 200);
}
