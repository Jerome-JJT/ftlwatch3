<?php

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

//https://gist.github.com/remy/5213884
function map($x, $in_min, $in_max, $out_min, $out_max) {
    return ($x - $in_min) * ($out_max - $out_min) / ($in_max - $in_min) + $out_min;
  }

function getHttpCode($code)
{

    $httpCode = array(
        100 => 'Continue',
        101 => 'Switching Protocols',
        102 => 'Processing',
        // WebDAV; RFC 2518
        103 => 'Early Hints',
        // RFC 8297
        200 => 'OK',
        201 => 'Created',
        202 => 'Accepted',
        203 => 'Non-Authoritative Information',
        // since HTTP/1.1
        204 => 'No Content',
        205 => 'Reset Content',
        206 => 'Partial Content',
        // RFC 7233
        207 => 'Multi-Status',
        // WebDAV; RFC 4918
        208 => 'Already Reported',
        // WebDAV; RFC 5842
        226 => 'IM Used',
        // RFC 3229
        300 => 'Multiple Choices',
        301 => 'Moved Permanently',
        302 => 'Found',
        // Previously "Moved temporarily"
        303 => 'See Other',
        // since HTTP/1.1
        304 => 'Not Modified',
        // RFC 7232
        305 => 'Use Proxy',
        // since HTTP/1.1
        306 => 'Switch Proxy',
        307 => 'Temporary Redirect',
        // since HTTP/1.1
        308 => 'Permanent Redirect',
        // RFC 7538
        400 => 'Bad Request',
        401 => 'Unauthorized',
        // RFC 7235
        402 => 'Payment Required',
        403 => 'Forbidden',
        404 => 'Not Found',
        405 => 'Method Not Allowed',
        406 => 'Not Acceptable',
        407 => 'Proxy Authentication Required',
        // RFC 7235
        408 => 'Request Timeout',
        409 => 'Conflict',
        410 => 'Gone',
        411 => 'Length Required',
        412 => 'Precondition Failed',
        // RFC 7232
        413 => 'Payload Too Large',
        // RFC 7231
        414 => 'URI Too Long',
        // RFC 7231
        415 => 'Unsupported Media Type',
        // RFC 7231
        416 => 'Range Not Satisfiable',
        // RFC 7233
        417 => 'Expectation Failed',
        418 => 'I\'m a teapot',
        // RFC 2324, RFC 7168
        421 => 'Misdirected Request',
        // RFC 7540
        422 => 'Unprocessable Entity',
        // WebDAV; RFC 4918
        423 => 'Locked',
        // WebDAV; RFC 4918
        424 => 'Failed Dependency',
        // WebDAV; RFC 4918
        425 => 'Too Early',
        // RFC 8470
        426 => 'Upgrade Required',
        428 => 'Precondition Required',
        // RFC 6585
        429 => 'Too Many Requests',
        // RFC 6585
        431 => 'Request Header Fields Too Large',
        // RFC 6585
        451 => 'Unavailable For Legal Reasons',
        // RFC 7725
        500 => 'Internal Server Error',
        501 => 'Not Implemented',
        502 => 'Bad Gateway',
        503 => 'Service Unavailable',
        504 => 'Gateway Timeout',
        505 => 'HTTP Version Not Supported',
        506 => 'Variant Also Negotiates',
        // RFC 2295
        507 => 'Insufficient Storage',
        // WebDAV; RFC 4918
        508 => 'Loop Detected',
        // WebDAV; RFC 5842
        510 => 'Not Extended',
        // RFC 2774
        511 => 'Network Authentication Required', // RFC 6585
    );

    return ($httpCode[$code]);
}


function logtologstash($status)
{
    $userId = "-1";
    $userLogin = "";
    if (isset($_SESSION["user"])) {
        $userId = $_SESSION["user"]["id"];
        $userLogin = $_SESSION["user"]["login"];
    } 


    $perms = "";
    $sessionId = "";
    if (isset($_REQUEST["permissions"])) {
        $perms = implode(",", $_REQUEST["permissions"]);
        $sessionId = substr($_REQUEST["PHPSESSID"], 0, 12);
    } 

    $currentTime = date('c');


    $logs = array(
        "api_user_id" => $userId,
        "api_user_login" => $userLogin,
        "api_user_perms" => $perms,
        "php_session_id" => $sessionId,
        "time_iso8601" => $currentTime,
        
        "remote_addr" => isset($_SERVER["HTTP_X_REAL_IP"]) ? $_SERVER["HTTP_X_REAL_IP"] : $_SERVER["REMOTE_ADDR"],
        "request_uri" => $_SERVER["REQUEST_URI"],
        "uri" => $_SERVER["SCRIPT_NAME"],
        "args" => $_SERVER["QUERY_STRING"],
        "status" => $status,
        "http_referer" => isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : '',
        "http_user_agent" => $_SERVER["HTTP_USER_AGENT"],
        "http_host" => $_SERVER["HTTP_HOST"],
        "server_name" => $_SERVER["SERVER_NAME"],
        "scheme" => $_SERVER["REQUEST_SCHEME"],
        "request_method" => $_SERVER["REQUEST_METHOD"], 
        "server_protocol" => $_SERVER["SERVER_PROTOCOL"]
    );

    $data = array();
    foreach ($logs as $key => $value) {
        $data[] = '"' . $key . '": "' . $value . '"';
    }
    $message = implode(", ", $data);

    $logstashHost = 'logstash';
    $logstashPort = 42112;

    try {
        $socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
        if ($socket === false) {
            mylogger("Failed to create socket", LOGGER_ERROR());
        } 
        else {
            $connect_timeval = array(
                "sec" => 0,
                "usec" => 500000
            );
            socket_set_option(
                $socket,
                SOL_SOCKET,
                SO_SNDTIMEO,
                $connect_timeval
            );
            socket_set_option(
                $socket,
                SOL_SOCKET,
                SO_RCVTIMEO,
                $connect_timeval
            );

            $result = @socket_sendto($socket, $message, strlen($message), 0, $logstashHost, $logstashPort);
    
            if ($result === false) {
                mylogger("Failed to send the message to Logstash", LOGGER_ERROR());
            } 
            // else {
            //     echo "Log message sent to Logstash.";
            // }
    
            socket_close($socket);
        }
    }
    catch (Exception $e) {
        mylogger("Exception in logtologstash", LOGGER_ERROR());
    }
}



function sentToRabbit($routing_key, $body) {

    $connection = new AMQPStreamConnection('rabbit', 5672, getenv("RABBIT_USER"), getenv("RABBIT_PASS"));
    
    $channel = $connection->channel();
    
    $msg = new AMQPMessage(json_encode($body));
    $channel->basic_publish($msg, 'main', $routing_key);
    
    $channel->close();
    $connection->close();
}


function logtrafic($status)
{
    $userId = "-1";
    $userLogin = "";
    if (isset($_SESSION["user"])) {
        $userId = $_SESSION["user"]["id"];
        $userLogin = $_SESSION["user"]["login"];
    } 


    // $perms = "";
    // $sessionId = "";
    // if (isset($_REQUEST["permissions"])) {
    //     $perms = implode(",", $_REQUEST["permissions"]);
    //     $sessionId = substr($_REQUEST["PHPSESSID"], 0, 12);
    // } 

    // $currentTime = date('c');

    $message = "$userId $userLogin $status ".$_SERVER['REQUEST_METHOD']." ".$_SERVER['HTTP_HOST']." ".$_SERVER['REQUEST_URI'];

    if ($_SERVER['REQUEST_URI'] != "/?page=specials&action=complain") {
        sentToRabbit('trafic.servercomplain.message.queue', array("content" => $message));
        // sentToRabbit('trafic.server.message.queue', array("content" => $message));
    }
}


function jsonResponse($data = array(), $code = 200, $isArray = false)
{
    logtologstash($code);
    logtrafic($code);
    
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');

    if ($code >= 400 && !isset($data["error"])) {
        $data["error"] = getHttpCode($code);
    }
    
    $flags = JSON_NUMERIC_CHECK;
    if (count($data) == 0) {
        $flags |= JSON_FORCE_OBJECT;
    }
    
    if (getenv("ENV") == "DEV") {
        $flags |= JSON_PRETTY_PRINT;
    }
    echo (json_encode($data, $flags));
    exit();
}


function LOGGER_DEBUG()
{
    return 0;
}

function LOGGER_INFO()
{
    return 1;
}

function LOGGER_WARNING()
{
    return 2;
}

function LOGGER_ERROR()
{
    return 3;
}

function LOGGER_ALERT()
{
    return 10;
}


function mylogger($log, $level)
{

    $lvltotxt = "";

    if ($level == 0) {
        $lvltotxt = "DEBUG";
    } else if ($level == 1) {
        $lvltotxt = "INFO";
    } else if ($level == 2) {
        $lvltotxt = "WARNING";
    } else if ($level == 3) {
        $lvltotxt = "ERROR";
    } else if ($level == 10) {
        $lvltotxt = "ALERT";
    } else {
        $lvltotxt = "UNKNOWN";
    }

    $myfile = fopen("/var/log/apache2/mylogger.log", "a");
    fwrite($myfile, $lvltotxt . " " . $log . "\n");
    fclose($myfile);

    if ($level >= LOGGER_WARNING()) {
        sentToRabbit('errors.server.message.queue', array('content' => $lvltotxt . " " . $log));
    }
}

function jsonlogger($msg, $data, $level)
{
    mylogger($msg . " " . json_encode($data), $level);
}

function userIsAdmin()
{
    if (isset($_SESSION["user"]) && isset($_SESSION["user"]["id"]) && in_array($_SESSION["user"]["id"], array("92477"))) {
        return true;
    }
    return false;
}



