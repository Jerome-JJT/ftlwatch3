<?php

function getGroupProjects($cursus = '')
{
  $query = "SELECT 
      te.team_id, te.team_name, te.retry_common,
      te.project_name, te.project_slug, 
      users.id AS user_id, users.login, users.avatar_url,
      team_user.is_leader AS user_is_leader,
      team_user.projects_user_id AS projects_user_id,
      te.is_validated, te.is_locked, te.status, te.final_mark,
      te.team_updated_at

    FROM users
    JOIN team_user ON team_user.user_id = users.id
    JOIN (
    
      SELECT 
        teams.id AS team_id, teams.name AS team_name, teams.retry_common,
        projects.id AS project_id, projects.name AS project_name, projects.slug AS project_slug,
        teams.is_validated, teams.is_locked, teams.status, teams.final_mark,
        date_part('epoch', teams.updated_at) AS team_updated_at

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

    ORDER BY te.team_updated_at ASC
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
      MAX(CASE WHEN is_locked THEN 1 ELSE 0 END) AS is_locked

    FROM teams
    JOIN team_user ON teams.id = team_user.team_id
    JOIN users ON users.id = team_user.user_id
    JOIN projects ON projects.id = teams.project_id
    JOIN project_types ON project_types.id = projects.project_type_id

    WHERE projects.main_cursus = 21
      AND users.hidden = False AND users.kind <> 'external' AND users.login NOT LIKE '3b3-%%' AND users.has_cursus21 = True AND (users.blackhole > NOW() OR users.grade = 'Member')
      AND project_types.name = 'common-core'
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
  $query = "SELECT pr.user_id, SUM(pr.is_validated) AS validated from 
    (SELECT 
      users.id AS user_id, users.login, projects.slug,
      SUM(CASE WHEN is_validated THEN 1 ELSE 0 END) AS is_validated,
      COUNT(projects.id) AS tries

      FROM teams
      JOIN team_user ON teams.id = team_user.team_id
      JOIN users ON users.id = team_user.user_id
      JOIN projects ON projects.id = teams.project_id
      JOIN project_types ON project_types.id = projects.project_type_id
      
      WHERE projects.main_cursus = 21 
        AND users.hidden = False AND users.kind <> 'external' AND users.login NOT LIKE '3b3-%%' AND users.has_cursus21 = True AND (users.blackhole > NOW() OR users.grade = 'Member')
        AND project_types.name = 'common-core'
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
  $query = "SELECT pr.user_id, SUM(pr.is_validated) AS validated from  
    (SELECT users.id AS user_id, users.login, projects.slug,
    SUM(CASE WHEN is_validated THEN 1 ELSE 0 END) AS is_validated,
      COUNT(projects.id) AS tries
      
      FROM teams
      JOIN team_user ON teams.id = team_user.team_id
      JOIN users ON users.id = team_user.user_id
      JOIN projects ON projects.id = teams.project_id
      JOIN project_types ON project_types.id = projects.project_type_id
      
      WHERE projects.main_cursus = 21 
        AND users.hidden = False AND users.kind <> 'external' AND users.login NOT LIKE '3b3-%%' AND users.has_cursus21 = True AND (users.blackhole > NOW() OR users.grade = 'Member')
        AND project_types.name = 'common-core'
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



function getSubjectsHeads()
{
  $query = "SELECT subject_hashmaps.id, subject_hashmaps.title, subject_hashmaps.title_hash, 
    projects.slug AS project_slug, 
    projects.slug AS project_slug, 
    subjects.id AS subject_id, 
    subjects.url AS subject_url,
    subjects.inserted_at AS subject_date
    FROM subjects
    
    JOIN subject_hashmaps ON subject_hashmaps.id = subjects.subject_hashmap_id
    LEFT JOIN projects ON projects.id = subject_hashmaps.project_id
    
    ORDER BY subjects.id ASC
  ";

  $data = array();

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

function getProjectSubjects($id)
{
  $query = "SELECT subject_hashmaps.id, subject_hashmaps.title, subject_hashmaps.title_hash, 
    projects.slug AS project_slug, 
    subjects.id AS subject_id, 
    subjects.url AS subject_url,
    subjects.inserted_at AS subject_date
    FROM subjects
    
    JOIN subject_hashmaps ON subject_hashmaps.id = subjects.subject_hashmap_id
    LEFT JOIN projects ON projects.id = subject_hashmaps.project_id

    WHERE subject_hashmaps.project_id = :project_id 
    OR projects.parent_id = :project_id
    OR (SELECT parent_id FROM projects WHERE id = :project_id) = subject_hashmaps.project_id
    
    ORDER BY subjects.id ASC
  ";

  $data = array(":project_id" => $id);

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}
