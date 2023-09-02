<?php
require_once("controller/_common.php");
require_once("model/intra.php");
require_once("model/permissions.php");



function tableau_api($filter, $projects)
{

    // $validfilters = getPoolFilters(false);

    // foreach ($validfilters as $filter) {
    //     if (!in_array(substr($filter, 0, 4), $validfilters)) {
    //         array_push($validfilters, substr($filter, 0, 4));
    //     }
    // }

    // array_push($validfilters, "cursus");
    // array_push($validfilters, "all");

    // if ($filter == "") {
    //     $filter = "cursus";
    // }

    // if (!in_array($filter, $validfilters)) {
    //     jsonResponse(array("error" => "Unknown filter"), 404);
    // }

    //TODO static in DB
    $currentFilter = "2023september";

    // if (substr($filter, 0, 4) == substr($currentFilter, 0, 4)) {
    //     needOnePermission(array("tableau_currentyear"));
    // } else if ($currentFilter) {
    //     needOnePermission(array("tableau_currentpool"));
    // }



    $res = array();

    $users = getUsers($filter);

    $res["values"] = $users;

    $res["columns"] = [
        ["label" => "ID", "field" => "id", "sortable" => true],
        ["label" => "Login", "field" => "login", "sortable" => true],
        ["label" => "First Name", "field" => "first_name", "sortable" => true],
        ["label" => "Last Name", "field" => "last_name", "sortable" => true],
        ["label" => "Display Name", "field" => "display_name", "sortable" => true],
        ["label" => "Avatar URL", "field" => "avatar_url", "sortable" => true],
        ["label" => "Grade", "field" => "grade", "sortable" => true],
        ["label" => "Level", "field" => "level", "sortable" => true],
        ["label" => "Kind", "field" => "kind", "sortable" => true],
        ["label" => "Staff", "field" => "is_staff", "sortable" => true],
        ["label" => "Nbcursus", "field" => "nbcursus", "sortable" => true],
        ["label" => "Has Cursus 21", "field" => "has_cursus21", "sortable" => true],
        ["label" => "Has Cursus 9", "field" => "has_cursus9", "sortable" => true],
        ["label" => "Pool Filter", "field" => "poolfilter", "sortable" => true]
    ];


    // $res["values"] = [
    //     [
    //         "name" => "Tiger Nixon",
    //         "position" => "System Architect",
    //         "office" => "Edinburgh",
    //         "age" => 61,
    //         "date" => "2011/04/25",
    //         "salary" => "$320,800"
    //     ],
    //     [
    //         "name" => "Garrett Winters",
    //         "position" => "Accountant",
    //         "office" => "Tokyo",
    //         "age" => 63,
    //         "date" => "2011/07/25",
    //         "salary" => "$170,750"
    //     ],
    //     [
    //         "name" => "Ashton Cox",
    //         "position" => "Junior Technical Author",
    //         "office" => "San Francisco",
    //         "age" => 66,
    //         "date" => "2009/01/12",
    //         "salary" => "$86,000"
    //     ],
    //     [
    //         "name" => "Cedric Kelly",
    //         "position" => "Senior Javascript Developer",
    //         "office" => "Edinburgh",
    //         "age" => 22,
    //         "date" => "2012/03/29",
    //         "salary" => "$433,060"
    //     ],
    //     [
    //         "name" => "Airi Satou",
    //         "position" => "Accountant",
    //         "office" => "Tokyo",
    //         "age" => 33,
    //         "date" => "2008/11/28",
    //         "salary" => "$162,700"
    //     ],
    //     [
    //         "name" => "Brielle Williamson",
    //         "position" => "Integration Specialist",
    //         "office" => "New York",
    //         "age" => 61,
    //         "date" => "2012/12/02",
    //         "salary" => "$372,000"
    //     ],
    //     [
    //         "name" => "Herrod Chandler",
    //         "position" => "Sales Assistant",
    //         "office" => "San Francisco",
    //         "age" => 59,
    //         "date" => "2012/08/06",
    //         "salary" => "$137,500"
    //     ],
    //     [
    //         "name" => "Rhona Davidson",
    //         "position" => "Integration Specialist",
    //         "office" => "Tokyo",
    //         "age" => 55,
    //         "date" => "2010/10/14",
    //         "salary" => "$327,900"
    //     ],
    //     [
    //         "name" => "Colleen Hurst",
    //         "position" => "Javascript Developer",
    //         "office" => "San Francisco",
    //         "age" => 39,
    //         "date" => "2009/09/15",
    //         "salary" => "$205,500"
    //     ],
    //     [
    //         "name" => "Sonya Frost",
    //         "position" => "Software Engineer",
    //         "office" => "Edinburgh",
    //         "age" => 23,
    //         "date" => "2008/12/13",
    //         "salary" => "$103,600"
    //     ],
    //     [
    //         "name" => "Jena Gaines",
    //         "position" => "Office Manager",
    //         "office" => "London",
    //         "age" => 30,
    //         "date" => "2008/12/19",
    //         "salary" => "$90,560"
    //     ],
    //     [
    //         "name" => "Quinn Flynn",
    //         "position" => "Support Lead",
    //         "office" => "Edinburgh",
    //         "age" => 22,
    //         "date" => "2013/03/03",
    //         "salary" => "$342,000"
    //     ],
    //     [
    //         "name" => "Charde Marshall",
    //         "position" => "Regional Director",
    //         "office" => "San Francisco",
    //         "age" => 36,
    //         "date" => "2008/10/16",
    //         "salary" => "$470,600"
    //     ],
    //     [
    //         "name" => "Haley Kennedy",
    //         "position" => "Senior Marketing Designer",
    //         "office" => "London",
    //         "age" => 43,
    //         "date" => "2012/12/18",
    //         "salary" => "$313,500"
    //     ]
    // ];

    // $res["columns"] = [
    //     [
    //         "label" => "Name",
    //         "field" => "name",
    //         "sortable" => true
    //     ],
    //     [
    //         "label" => "Position",
    //         "field" => "position",
    //         "sortable" => false
    //     ],
    //     [
    //         "label" => "Office",
    //         "field" => "office",
    //         "sortable" => false
    //     ],
    //     [
    //         "label" => "Age",
    //         "field" => "age",
    //         "sortable" => false
    //     ],
    //     [
    //         "label" => "Start date",
    //         "field" => "date",
    //         "sortable" => true
    //     ],
    //     [
    //         "label" => "Salary",
    //         "field" => "salary",
    //         "sortable" => false
    //     ]
    // ];

    jsonResponse($res, 200);

}


function login($post)
{

    if (isset($post["login"]) && isset($post["password"])) {

        $isLogin = loginUser($post["login"], $post["password"], true);

        if ($isLogin) {
            login_way($post["login"]);
        }

        // print_r("value");
        // print_r($isLogin);
    } else {
        jsonResponse(array(), 400);
    }
}

function loginapi_authorize()
{

    $authorization_redirect_url = "https://api.intra.42.fr/oauth/authorize?response_type=code";
    $authorization_redirect_url .= "&client_id=" . getenv("API_UID") . "&redirect_uri=" . getenv("FRONT_PREFIX") . "/loginapi" . "&scope=public";

    header("Location: " . $authorization_redirect_url);
    exit();
}

function loginapi_callback($post)
{

    if (isset($post["code"])) {

        require_once("controller/api.php");
        $response = code_exchange($post["code"]);

        if ($response === false) {
            jsonResponse(array(), 406);
        }

        $raw = json_decode($response);

        if (isset($raw->error)) {
            jsonResponse(array("error" => $raw->error), 406);
        }

        $token = array("access_token" => $raw->access_token, "expires_in" => $raw->expires_in, "refresh_token" => $raw->refresh_token);

        $meInfos = getResource($token["access_token"], "/v2/me");

        if (isset($meInfos->status) && $meInfos->status == 401) {
            jsonResponse(array("error" => $meInfos->error), 401);
        }


        if (!loginUser($meInfos["login"], null, false)) {
            storeUser($meInfos, 0);
        } else {
            storeUser($meInfos, 1);
        }

        login_way($meInfos["login"]);

        // return ($token);
    } else {
        jsonResponse(array(), 400);
    }
}

function storeUser($res, $exists = 0)
{
    require_once("model/account.php");

    $good_firstname = isset($res["usual_first_name"]) ? $res["usual_first_name"] : $res["first_name"];
    $good_displayname = isset($res["usual_full_name"]) ? $res["usual_full_name"] : $res["displayname"];

    $good_avatar_url = "";
    if (isset($res["image"]["versions"]["medium"])) {
        $good_avatar_url = $res["image"]["versions"]["medium"];
    }
    if ($good_avatar_url == "" && isset($res["image"]["link"])) {
        $good_avatar_url = $res["image"]["link"];
    }

    $good_number = -1;
    if (isset($res['coalition_id'])) {
        $good_number = $res['coalition_id'];
    }

    if ($exists == 0) {
        createAccount($res["id"], $res["login"], $good_firstname, $res["last_name"], $good_displayname, $good_avatar_url, $good_number);
    } else {
        updateAccount($res["id"], $res["login"], $good_firstname, $res["last_name"], $good_displayname, $good_avatar_url, $good_number);
    }
}


function logout()
{

    $_SESSION = array();
    session_destroy();
    jsonResponse(array(), 204);
}