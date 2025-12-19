<?php

use Bramus\Router\Router;
use App\Config\DB;
use App\Middlewares\VerifyToken;
use Illuminate\Database\Capsule\Manager as Capsule;

$router = new Router();


DB::initialize();


//$router->setBasePath('/api');

$router->options('/.*', function () {
    header('Access-Control-Allow-Origin:' . $_ENV['CORS_ORIGIN']);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization ');
    header('access-control-allow-credentials: true');
    exit;
});

$router->before('GET|POST|PUT|PATCH|DELETE', '/.*', function () {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin:' . $_ENV['CORS_ORIGIN']);
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
//$router->before('GET|POST|PUT|DELETE|PATCH', '(?!auth/login|auth/register|/dbtest).*', VerifyToken::class . '@handle');
$router->before('GET|POST|PUT|DELETE|PATCH', '^/(?!auth/|dbtest).*', VerifyToken::class . '@handle');

$router->get('/dbtest', function () {
    try {
        // Intenta obtener el primer usuario de tu tabla.
        // Asumo que tu modelo se llama 'User' y está cargado.
        // Si no usas Eloquent, usa una consulta PDO simple.

        $user = Capsule::table('users')->first();

        if ($user) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Conexión DB y consulta OK.", "user_id" => $user->id]);
        } else {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Conexión DB OK, pero tabla de usuarios VACÍA."]);
        }

    } catch (\Throwable $e) {
        // Captura cualquier error, especialmente el de conexión
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "FALLO CRiTICO DE CONEXIoN O CONSULTA. " . $e->getMessage()]);
    }
});



require 'src/Modules/Auth/Router.php';
require 'src/Modules/User/Router.php';
require 'src/Modules/Role/Router.php';
require 'src/Modules/List/Router.php';
require 'src/Modules/Item/Router.php';


$router->run();
