<?php

namespace App\Config;

use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;

class DB
{
    public static function initialize()
    {
        $capsule = new Capsule();
        try {
            $capsule->addConnection([
                'driver'    => $_ENV['DB_DRIVER'],
                'host'      => $_ENV['DB_HOST'],
                'database'  => $_ENV['DB_DATABASE'],
                'username'  => $_ENV['DB_USERNAME'],
                'password'  => $_ENV['DB_PASSWORD'],
                'port'      => $_ENV['DB_PORT'] ?? 3306,
                'charset'   => 'utf8',
                'collation' => 'utf8_unicode_ci',
                'prefix'    => '',
            ]);

            $capsule->setAsGlobal();

            $capsule->bootEloquent();
        } catch (\PDOException $e) {
            // Manejo de error de conexión: Es crucial en producción.
            self::handleConnectionError($e);
        }

    }

    protected static function handleConnectionError(\PDOException $e)
    {
        $env = $_ENV['ENVIRONMENT'] ?? 'production';

        if ($env === 'production') {
            http_response_code(500);
            // Muestra un error genérico y seguro para el usuario
            die(json_encode(["error" => "Error de conexión interna del servidor." . $e->getMessage()]));
        } else {
            // Muestra el error de la DB directamente en local para debug
            die("Error de Conexión a la DB en Local: " . $e->getMessage());
        }
    }

}
