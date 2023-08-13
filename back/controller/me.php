<?php

function me()
{

  // mylogger("ME ASKED ".$_SESSION["user"], LOGGER_DEBUG());
  // mylogger("ME ASKED ".implode(" ", array_keys($_SESSION["user"])), LOGGER_DEBUG());
  if (isset($_SESSION["user"])) {


    jsonResponse(
      array(
        "user" => $_SESSION["user"],
        "pages" => $_SESSION["pages"]
      ),
      200
    );
  } else {
    jsonResponse(array(), 400);
  }
}