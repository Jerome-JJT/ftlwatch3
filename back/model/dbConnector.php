<?php
require_once("controller/_common.php");


//Database select function, return with indexed column name and not numeral
function executeQuerySelect($query, $data = array())
{
  try {
    $queryResult = array();

    //Open database connection
    $pdo = openDBConnection();

    if ($pdo != null) {
      $stm = $pdo->prepare($query);
      $stm->execute($data);
      $queryResult = $stm->fetchAll(PDO::FETCH_ASSOC);
    }

    //Close database connection
    $pdo = null;
    return $queryResult;
  } catch (Exception $e) {
    mylogger("Caught exception query select " . $e->getMessage(), LOGGER_ERROR());
    throw $e;
  }
}


//Database insert function, allow sending multiple data with same query with repeat option
//For single query, return inserted id and false for query error
function executeQueryAction($query, $data = array(), $repeat = false)
{
  try {
    //Open database connection
    $pdo = openDBConnection();
    $result = true;

    if ($pdo != null) {
      $stm = $pdo->prepare($query);

      //Single query option
      if (!$repeat) {
        $stm->execute($data);
        // $result = $pdo->lastInsertId();
      } else {
        //Multiple query option
        foreach ($data as $value) {
          $result &= $stm->execute($value);
        }
      }
    }

    //Close database connection
    $pdo = null;
    return $result;
  } catch (Exception $e) {
    mylogger("Caught exception query action " . $e->getMessage(), LOGGER_ERROR());
    throw $e;
  }
}


//Database connection management
function openDBConnection()
{
  $dbConnection = null;

  $sql = getenv('DATABASE_CONNECT');
  $hostname = getenv('DATABASE_HOST');
  $port = getenv('DATABASE_PORT');
  $charset = 'utf8';
  $dbName = getenv('DATABASE_DB');
  $userName = getenv('DATABASE_USER');
  $userPwd = getenv('DATABASE_PASSWORD');
  $dsn = $sql . ':host=' . $hostname . ';dbname=' . $dbName . ';port=' . $port;

  try {
    $dbConnection = new PDO($dsn, $userName, $userPwd);
  } catch (PDOException $e) {
    echo ("PDO error");
    print_r($e);
    echo ("<br>");
  }

  return $dbConnection;
}