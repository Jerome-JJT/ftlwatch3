<?php 



function code_exchange($code) {
  $header = array("Content-Type: application/x-www-form-urlencoded");
  $content = "client_id=".getenv("API_UID")."&client_secret=".getenv("API_SECRET");
  $content .= "&grant_type=authorization_code&code=".$code."&redirect_uri=".getenv("FRONT_PREFIX")."/loginapi";

  $curl = curl_init();
  curl_setopt_array($curl, array(
      CURLOPT_URL => "https://api.intra.42.fr/oauth/token",
      CURLOPT_HTTPHEADER => $header,
      CURLOPT_SSL_VERIFYPEER => false,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $content
  ));
  $response = curl_exec($curl);
  curl_close($curl);

  return $response;
}

function getResource($token, $endpoint) {
  $header = array("Authorization: Bearer {$token}");

  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_URL => "https://api.intra.42.fr".$endpoint,
    CURLOPT_HTTPHEADER => $header,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_RETURNTRANSFER => true
  ));
  $response = curl_exec($curl);
  curl_close($curl);

  return json_decode($response, true);
}