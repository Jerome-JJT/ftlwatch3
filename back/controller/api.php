<?php 



function code_exchange($code, $next) {

  $redirect_uri = getenv("CALLBACK_URL");
  if (strlen($next) > 0) {
      $redirect_uri .= "?next=" . $next;
  }

  $header = array("Content-Type: application/x-www-form-urlencoded");
  $content = "client_id=".getenv("API_UID")."&client_secret=".getenv("API_SECRET");
  $content .= "&grant_type=authorization_code&code=".$code."&redirect_uri=".urlencode($redirect_uri);

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
  $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
  curl_close($curl);

  
  if ($httpCode == 429) {
    jsonResponse(array("details" => "apibackend"), 429);
  }
  
  return json_decode($response, true);
}