<?php

function getGroupProjects($cursus = '')
{
  $query = "SELECT 
      te.team_id, te.team_name, te.retry_common,
      te.project_name, 
      users.id AS user_id, users.login, users.avatar_url,
      team_user.is_leader AS user_is_leader,
      te.is_validated, te.is_locked, te.status, te.final_mark,
      te.team_updated_at

    FROM users
    JOIN team_user ON team_user.user_id = users.id
    JOIN (
    
      SELECT 
        teams.id AS team_id, teams.name AS team_name, teams.retry_common,
        projects.id AS project_id, projects.name AS project_name,
        teams.is_validated, teams.is_locked, teams.status, teams.final_mark,
        date_part('epoch', teams.updated_at)  AS team_updated_at

      FROM teams
      JOIN team_user ON teams.id = team_user.team_id
      JOIN users ON users.id = team_user.user_id
      left JOIN projects ON projects.id = teams.project_id
      
      WHERE projects.main_cursus is null or projects.main_cursus = :cursus 
      AND users.hidden = FALSE
      
      GROUP BY teams.id, projects.id
      HAVING COUNT(team_user.id) >= 2
    ) te
    
    ON te.team_id = team_user.team_id
  ";

  $data = array(":cursus" => $cursus);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}


function getUserProjects()
{
  $query = "SELECT 
      users.id AS user_id, users.login, users.avatar_url,
      projects.id AS project_id, projects.slug AS project_slug,
      MAX(CASE WHEN is_locked THEN 1 END) AS is_locked

    FROM teams
    JOIN team_user ON teams.id = team_user.team_id
    JOIN users ON users.id = team_user.user_id
    JOIN projects ON projects.id = teams.project_id

    WHERE projects.main_cursus = 21
    AND users.hidden = FALSE

    GROUP BY users.id, projects.id
  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

function getProjectsCount()
{
  $query = "SELECT pr.user_id, COUNT(pr.is_validated) AS validated from 
    (SELECT 
      users.id AS user_id, users.login, projects.slug,
      COUNT(CASE WHEN is_validated THEN 1 END) AS is_validated,
      COUNT(projects.id) AS tries

      FROM teams
      JOIN team_user ON teams.id = team_user.team_id
      JOIN users ON users.id = team_user.user_id
      JOIN projects ON projects.id = teams.project_id
      
      WHERE projects.main_cursus = 21 
        AND projects.slug NOT LIKE 'exam-%'
      
      GROUP BY users.id, projects.id, users.id 
    ) pr
  GROUP BY pr.user_id
  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

function getExamCount()
{
  $query = "SELECT pr.user_id, COUNT(pr.is_validated) AS validated from  
    (SELECT users.id AS user_id, users.login, projects.slug,
      COUNT(CASE WHEN is_validated THEN 1 END) AS is_validated,
      COUNT(projects.id) AS tries
      
      FROM teams
      JOIN team_user ON teams.id = team_user.team_id
      JOIN users ON users.id = team_user.user_id
      JOIN projects ON projects.id = teams.project_id
      
      WHERE projects.main_cursus = 21 
        AND projects.slug LIKE 'exam-%'
      
      GROUP BY users.id, projects.id
    ) pr
  GROUP BY pr.user_id

  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}
