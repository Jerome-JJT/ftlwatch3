<?php

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
    $userId = "";
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


    $data = array(
        "api_user_id" => $userId,
        "api_user_login" => $userLogin,
        "api_user_perms" => $perms,
        "php_session_id" => $sessionId,
        "time_iso8601" => $currentTime,
        
        "remote_addr" => $_SERVER["REMOTE_ADDR"],
        "request_uri" => $_SERVER["REQUEST_URI"],
        "uri" => $_SERVER["SCRIPT_NAME"],
        "args" => $_SERVER["QUERY_STRING"],
        "status" => $status,
        "http_referer" => $_SERVER["HTTP_REFERER"],
        "http_user_agent" => $_SERVER["HTTP_USER_AGENT"],
        "http_host" => $_SERVER["HTTP_HOST"],
        "server_name" => $_SERVER["SERVER_NAME"],
        "scheme" => $_SERVER["REQUEST_SCHEME"],
        "request_method" => $_SERVER["REQUEST_METHOD"], 
        "server_protocol" => $_SERVER["SERVER_PROTOCOL"]
    );


    $logstashHost = 'logstash';
    $logstashPort = 1026;

    $socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
    if ($socket === false) {
        mylogger("Failed to create socket", LOGGER_ERROR());
    } else {
        $message = json_encode($data);
        $result = socket_sendto($socket, $message, strlen($message), 0, $logstashHost, $logstashPort);

        if ($result === false) {
            mylogger("Failed to send the message to Logstash", LOGGER_ERROR());
        } 
        // else {
        //     echo "Log message sent to Logstash.";
        // }

        socket_close($socket);
    }
}

function jsonResponse($data = array(), $code = 200, $isArray = false)
{
    logtologstash($code);
    
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
    } else {
        $lvltotxt = "UNKNOWN";
    }

    $myfile = fopen("/var/log/apache2/mylogger.log", "a");
    fwrite($myfile, $lvltotxt . " " . $log . "\n");
    fclose($myfile);
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



