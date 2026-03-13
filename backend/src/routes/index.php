<?php

use Bramus\Router\Router;
use App\Config\DB;
use App\Middlewares\VerifyToken;
use Illuminate\Database\Capsule\Manager as Capsule;

$router = new Router();
$router->setBasePath('/backend');

//users/lists test dev
/* $router->get('/users/lists', function () {
    header('Content-Type: application/json');
    echo json_encode(["status" => "success", "message" => "Ruta de prueba para users/lists"]);
    exit; // Detiene la ejecución para evitar que DB::initialize() se ejecute en esta ruta de prueba
}); */

if (isset($_SERVER['REQUEST_URI']) && parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) == '/health') {
    header('Content-Type: application/json');
    echo json_encode(["status" => "success", "message" => "Integridad OK"]);
    exit; // Aquí se detiene y NUNCA llega a DB::initialize()
}

$router->get  ('/', function () {
    header('Content-Type: application/json');
    echo json_encode(["status" => "success", "message" => "API RESTful en PHP con autenticación JWT y Eloquent ORM"]);
});


DB::initialize();



$router->options('/.*', function () {
    //$allowedOrigins = explode(',', $_ENV['CORS_ORIGIN'] ?? '');
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

   /*  if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    } */

    header('Access-Control-Allow-Origin:' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, ngrok-skip-browser-warning');
   // header('Access-Control-Allow-Headers: Content-Type, Authorization ');
    header('access-control-allow-credentials: true');
    exit;
});

$router->before('GET|POST|PUT|PATCH|DELETE', '/.*', function () {
    //header('Access-Control-Allow-Origin:' . $_ENV['CORS_ORIGIN']);
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
   /*  $allowedOrigins = explode(',', $_ENV['CORS_ORIGIN'] ?? '');
    if (in_array($origin, $allowedOrigins)) {
    } */

    header('Access-Control-Allow-Origin:' . $origin);
    header('access-control-allow-credentials: true');
    header('Content-Type: application/json');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, ngrok-skip-browser-warning');
});
$router->before('GET|POST|PUT|DELETE|PATCH', '(?!auth/login|auth/register|health|public|pub).*', VerifyToken::class . '@handle');

$router->before('POST|PUT|PATCH', '/.*', function () {
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        $body = file_get_contents('php://input');
        $body = json_decode($body, true);
        $_POST = $body;
    }
});

$router->get('/dbtest', function () {
    try {
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



/* require 'src/Modules/Auth/Router.php';
require 'src/Modules/User/Router.php';
require 'src/Modules/Role/Router.php';
require 'src/Modules/List/Router.php';
require 'src/Modules/Item/Router.php';
require 'src/Modules/Item/Router.php'; */




$moduleRouters = glob(__DIR__ . '/../Modules/*/Router.php');
foreach ($moduleRouters as $routerFile) {
    require_once $routerFile;
} 
    

$router->run();
