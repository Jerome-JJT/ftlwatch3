<?php
require_once("controller/_common.php");


$updates = array(
    array('id' => 'achievements', 'name' => 'Update achievements', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'achievements')); }),
    array('id' => 'campus', 'name' => 'Update campus', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'campus')); }),
    array('id' => 'coalitions', 'name' => 'Update coalitions', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'coalitions')); }),
    array('id' => 'cursus', 'name' => 'Update cursus', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'cursus')); }),
    array('id' => 'groups', 'name' => 'Update groups', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'groups')); }),
    array('id' => 'products', 'name' => 'Update products', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'products')); }),
    array('id' => 'projects', 'name' => 'Update projects', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'projects')); }),
    array('id' => 'titles', 'name' => 'Update titles', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'titles')); }),
    array('id' => 'users', 'name' => 'Update users', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'users')); }),
    array('id' => 'events', 'name' => 'Update events', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'events')); }),
    array('id' => 'offers', 'name' => 'Update offers', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'offers')); }),

    array('id' => 'intranotif', 'name' => 'Update intra notifs', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'intranotif')); }),


    array('id' => 'generate_users_coals', 'name' => 'Update users coals', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'users_coals')); }),
    array('id' => 'generate_users_points', 'name' => 'Update users points', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'users_points')); }),
    
    array('id' => 'update_pdf', 'name' => 'Update pdf subjects', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'update_pdf')); }),
    array('id' => 'process_pdf', 'name' => 'Process pdf subjects', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'process_pdf')); }),
    
    array('id' => 'generate_locations', 'name' => 'Run locations', 'updater' => function () { sentToRabbit('fast.update.queue', array('resource' => 'locations')); }),
    array('id' => 'generate_teams', 'name' => 'Run teams', 'updater' => function () { sentToRabbit('fast.update.queue', array('resource' => 'teams')); }),

    array('id' => 'process_locations', 'name' => 'Process locations', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'process_locations')); }),
    array('id' => 'generate_love', 'name' => 'Generate love', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'generate_love')); }),
    array('id' => 'generate_peaks', 'name' => 'Generate peaks', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'generate_peaks')); }),
    array('id' => 'generate_fall', 'name' => 'Generate fall', 'updater' => function () { sentToRabbit('slow.update.queue', array('resource' => 'generate_fall')); }),
);


function get()
{
    global $updates;

    $res = array();

    $res["values"] = array_map(function ($value) {
        return array("id" => $value["id"], "name" => $value["name"]);
    }, $updates);

    jsonResponse($res, 200);
}


function update($action)
{
    global $updates;


    $to_update = array_filter($updates, function ($value) use ($action) {
        return $action == $value["id"];
    });


    if (count($to_update) == 1) {
        array_values($to_update)[0]["updater"]();
        jsonResponse(array(), 204);
    }
    else {
        jsonResponse(array(), 400);
    }
}
