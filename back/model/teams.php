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


function getUserProjects($cursus = '')
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
    ) te
    
    ON te.team_id = team_user.team_id
  ";

  $data = array(":cursus" => $cursus);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

function getProjectsCount()
{
  $query = "select ex.user_id, count(ex.ccount) as c1 from 
      (SELECT 
      count(projects.id) AS ccount, users.id AS user_id

      FROM teams
      JOIN team_user ON teams.id = team_user.team_id
      JOIN users ON users.id = team_user.user_id
      JOIN projects ON projects.id = teams.project_id
      
      WHERE projects.main_cursus = 21 
        AND projects.slug like 'exam-%'
      
      GROUP BY users.id, projects.id
      ) ex

  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

function getExamCount()
{
  $query = "select ex.user_id, count(ex.ccount) as c1 from 
      (SELECT 
      count(projects.id) AS ccount, users.id AS user_id

      FROM teams
      JOIN team_user ON teams.id = team_user.team_id
      JOIN users ON users.id = team_user.user_id
      JOIN projects ON projects.id = teams.project_id
      
      WHERE projects.main_cursus = 21 
        AND projects.slug like 'exam-%'
      
      GROUP BY users.id, projects.id
      ) ex

  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}
