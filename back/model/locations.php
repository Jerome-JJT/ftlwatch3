<?php

function getUsersComputers()
{
  $query = "SELECT users.login, v_users_computers.host, 
      v_users_computers.total_length, v_users_computers.rank
    FROM v_users_computers
    JOIN users ON users.id = v_users_computers.user_id
    WHERE rank < 10
      AND users.hidden = FALSE
  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}


function getUsersTotals()
{
  $query = "SELECT users.login, 
    SUM(locations.length) AS total,
    COUNT(locations.length) AS entries,
    COUNT(DISTINCT locations.host) AS nb_hosts,
    AVG(locations.length) AS average,
    SUM(CASE WHEN is_piscine = TRUE THEN length ELSE 0 END) AS total_piscine,
    SUM(locations.sun_length) AS total_sun,
    SUM(locations.moon_length) AS total_moon,
    SUM(CASE WHEN locations.host LIKE 'c1%' THEN length ELSE 0 END) AS total_c1,
    SUM(CASE WHEN locations.host LIKE 'c2%' THEN length ELSE 0 END) AS total_c2,
    SUM(CASE WHEN locations.host LIKE 'c3%' THEN length ELSE 0 END) AS total_c3
    FROM locations
    JOIN users ON users.id = locations.user_id
    WHERE locations.length < 100000 AND users.hidden = FALSE
    GROUP BY users.id
    ORDER BY total DESC
  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}


function getComputersTotals()
{
  $query = "SELECT locations.host,
    SUM(locations.length) AS total,
    COUNT(locations.length) AS entries,
    AVG(locations.length) AS average,
    SUM(CASE WHEN is_piscine = TRUE THEN length ELSE 0 END) AS total_piscine,
    SUM(locations.sun_length) AS total_sun,
    SUM(locations.moon_length) AS total_moon
    FROM locations
    WHERE locations.length < 100000
    GROUP BY locations.host
    ORDER BY total DESC
  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}


function getPersonalComputers($userId, $userLogin)
{
  $query = "SELECT locations.host,
  SUM(locations.length) AS total,
  SUM(CASE WHEN is_piscine = TRUE THEN locations.length ELSE 0 END) AS total_piscine
  FROM locations

  JOIN users ON users.id = locations.user_id

  WHERE locations.length < 100000 AND (
    (CAST(:user_id AS INTEGER) IS NOT NULL AND locations.user_id = :user_id)
    OR (CAST(:user_login AS VARCHAR) IS NOT NULL AND users.login = :user_login)
    )

  GROUP BY locations.host
  ORDER BY total DESC
  ";

  $data = array("user_id" => $userId, "user_login" => $userLogin);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

