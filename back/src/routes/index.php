<?php

use Bramus\Router\Router;
use App\Config\DB;
use App\Middlewares\VerifyToken;

$router = new Router();

DB::initialize();


$router->setBasePath('/api');

$router->options('/.*', function() {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization ');
    header('access-control-allow-credentials: true');
    exit;
});

$router->before('GET|POST|PUT|PATCH|DELETE', '/.*', function () {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('access-control-allow-credentials: true');
});

$router->before('POST|PUT|PATCH', '/.*', function () {
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        $body = file_get_contents('php://input');
        $body = json_decode($body, true);
        $_POST = $body;
    }
});

//validate token for all routes except auth/login and auth/register
$router->before('GET|POST|PUT|DELETE|PATCH', '/(?!auth/login|auth/register).*', VerifyToken::class . '@handle');



require 'src/Modules/Auth/Router.php';
require 'src/Modules/User/Router.php';
require 'src/Modules/Role/Router.php';
require 'src/Modules/List/Router.php';
require 'src/Modules/Item/Router.php';


$router->run();
