<?php 


function getAchievements()
{
  $query = "SELECT achievements.id, achievements.name AS achievement_name, achievements.description, 
  achievements.kind, achievements.image, achievements.has_lausanne, titles.name AS title_name
  FROM achievements
  LEFT JOIN titles ON titles.id = achievements.title_id
  ORDER BY id";
  $data = array();

  require_once("model/dbConnector.php");
  $achievements = executeQuerySelect($query, $data);

  return $achievements;
}

