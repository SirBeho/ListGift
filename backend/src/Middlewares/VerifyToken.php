<?php

namespace App\Middlewares;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Modules\User\Model as UserModel;

class VerifyToken
{
    public static function handle()
    {
        // 1. Verificar existencia del token
        if (!isset($_COOKIE['token'])) {
            self::respondError('Token no proporcionado', 401);
        }

        try {
            // 2. Decodificar (Sintaxis v7)
            $decoded = JWT::decode($_COOKIE['token'], new Key($_ENV['JWT_SECRET'], 'HS256'));
            $_REQUEST['auth'] = (array) $decoded;
          
        } catch (\Firebase\JWT\ExpiredException $e) {
            self::respondError('La sesión ha expirado', 401);
        } catch (\Exception $e) {
            self::respondError('Token inválido', 401);
        }
    }

    // Helper para mantener la respuesta normalizada
    private static function respondError($message, $code)
    {
        http_response_code($code);
        echo json_encode([
            'status' => 'error',
            'message' => $message,
            'errors' => (object)[]
        ]);
        exit;
    }
}