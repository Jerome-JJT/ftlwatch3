<?php

function getEvents($cursus = '')
{
  $query = "SELECT users.login, events.id, events.name, events.description, 
    events.location, events.kind, events.max_people, 
    events.has_cursus21, events.has_cursus9,
    events.begin_at, events.end_at
    
    FROM event_user 
    
    JOIN users ON users.id = event_user.user_id
    JOIN events ON events.id = event_user.event_id

    ORDER BY begin_at DESC, login ASC
  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

