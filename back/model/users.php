<?php

function getUsersShort($hidden)
{
  $query = "SELECT 
  users.id,
  users.login,
  users.avatar_url,
  users.kind,
  users.is_staff,
  users.has_cursus21,
  users.has_cursus9,
  poolfilters.name AS poolfilter,
  users.hidden
  
  FROM users
  JOIN poolfilters ON users.poolfilter_id = poolfilters.id

  WHERE (:show_hidden = TRUE OR (
    users.hidden = FALSE
    AND users.login NOT LIKE '3b3-%'
    AND users.has_cursus21 = True
    AND (users.blackhole > NOW() OR users.grade = 'Member')
  ))
  ORDER BY login
  ";

  $data = array(":show_hidden" => $hidden ? "TRUE" : "FALSE");

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}

function getUsers($hidden, $poolfilter = '')
{
  $query = "SELECT 
  users.id,
  users.login,
  users.first_name,
  users.last_name,
  users.display_name,
  users.avatar_url,

  users.kind,
  users.is_staff,
  users.is_active,
  users.is_alumni,
  users.wallet,  
  users.correction_point,

  users.nbcursus,
  users.has_cursus21,
  users.has_cursus9,
  cursus21_coalition.name AS cursus21_coalition,
  cursus9_coalition.name AS cursus9_coalition,
  COALESCE(cursus21_coalition.color, cursus9_coalition.color) AS _line_color,
  
  users.blackhole,
  COALESCE(EXTRACT(DAY FROM users.blackhole - NOW()), 1000000) AS blackhole_diff,
  users.grade,
  users.level,

  users.is_bde,
  users.is_tutor,

  poolfilters.name AS poolfilter
  
  FROM users
  JOIN poolfilters ON users.poolfilter_id = poolfilters.id

  LEFT JOIN coalitions cursus21_coalition ON cursus21_coalition.id = users.cursus21_coalition_id 
  LEFT JOIN coalitions cursus9_coalition ON cursus9_coalition.id = users.cursus9_coalition_id 


  WHERE (users.hidden = FALSE)
  AND (
       (:poolfilter = 'all')
    OR (:poolfilter = 'cursus' AND (
      users.has_cursus21 = TRUE
      AND (users.blackhole > NOW() OR users.grade = 'Member' OR :hidden = TRUE)
      AND users.login NOT LIKE '3b3-%'
    ))
    OR (poolfilters.name LIKE CONCAT(:poolfilter,'%'))
  )
  ORDER BY login
  ";

  $data = array(":poolfilter" => $poolfilter, ":hidden" => $hidden ? "TRUE" : "FALSE");

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}


function getUserImages($hidden, $poolfilter = '')
{
  $query = "SELECT 
  users.id,
  users.login,
  users.first_name,
  users.last_name,
  users.display_name,
  users.avatar_url,

  poolfilters.name AS poolfilter
  
  FROM users
  JOIN poolfilters ON users.poolfilter_id = poolfilters.id

  WHERE (users.hidden = false OR users.hidden = :hidden)
  AND (
       (:poolfilter = 'all')
    OR (:poolfilter = 'cursus' AND (
      users.has_cursus21 = TRUE
      AND (users.blackhole > NOW() OR users.grade = 'Member')
       AND users.login NOT LIKE '3b3-%'
    ))
    OR (poolfilters.name LIKE CONCAT(:poolfilter,'%'))
  )
  ORDER BY login
  ";

  $data = array(":poolfilter" => $poolfilter, ":hidden" => $hidden ? "TRUE" : "FALSE");

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}



function setUser($userId, $value)
{
  $query = "UPDATE users
  SET hidden = :hidden
  WHERE id = :user_id";

  $data = array(":user_id" => $userId, ":hidden" => $value == "true" ? "TRUE" : "FALSE");

  return executeQueryAction($query, $data);
}




function getUserProjects($hidden, $poolfilter, $projects)
{
  $query = "SELECT 
  users.id AS user_id,
  users.login,
  users.first_name,
  users.last_name,
  users.display_name,
  users.avatar_url,
  projects.id AS project_id,
  projects.slug AS project_slug,
  projects.main_cursus,
  MAX(teams.final_mark) AS final_mark,
  COALESCE(cursus21_coalition.color, cursus9_coalition.color) AS _line_color
  
  FROM users

  LEFT JOIN team_user ON team_user.user_id = users.id
  LEFT JOIN teams ON teams.id = team_user.team_id
  LEFT JOIN projects ON projects.id = teams.project_id
  LEFT JOIN cursus ON cursus.id = projects.main_cursus
  LEFT JOIN project_types ON project_types.id = projects.project_type_id

  LEFT JOIN coalitions cursus21_coalition ON cursus21_coalition.id = users.cursus21_coalition_id 
  LEFT JOIN coalitions cursus9_coalition ON cursus9_coalition.id = users.cursus9_coalition_id 

  JOIN poolfilters ON users.poolfilter_id = poolfilters.id

  WHERE (users.hidden = FALSE OR users.hidden = :hidden)
  AND (
       (:poolfilter = 'all')
    OR (:poolfilter = 'cursus' AND (
      users.has_cursus21 = TRUE
      AND (users.blackhole > NOW() OR users.grade = 'Member')
      AND users.login NOT LIKE '3b3-%'
    ))
  )
  AND (projects.has_lausanne IS NULL OR projects.has_lausanne <> FALSE)
  AND (
       (projects.id IS NULL)
    OR (:projects = cursus.slug)
    OR (:projects = project_types.name)
    )

  GROUP BY users.id, projects.id, cursus21_coalition.color, cursus9_coalition.color
  ORDER BY projects.corder, projects.slug
  ";

  $data = array(":poolfilter" => $poolfilter, ":projects" => $projects, ":hidden" => $hidden == true ? "TRUE" : "FALSE");

  require_once("model/dbConnector.php");
  $result = executeQuerySelect($query, $data);

  return $result;
}


