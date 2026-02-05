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

        $token = $_COOKIE['token'];

        try {
            // 2. Decodificar (Sintaxis v7)
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
            $decodedArray = (array) $decoded;

            // 3. Buscar usuario y cargar rol
            $user = UserModel::with('Lists')->find($decodedArray['user']);

            if (!$user) {
                self::respondError('Usuario no encontrado', 401);
            }

            // 4. Guardar en $_REQUEST para el controlador
            $_REQUEST['auth'] = $decodedArray;
            $_REQUEST['auth']['user_data'] = $user;

            // Si la ruta actual es la de "verificarme", respondemos aquí mismo
            if ($_SERVER['REQUEST_URI'] === '/auth/verify') {
                echo json_encode([
                    'status' => 'success',
                    'user' => $_REQUEST['auth']['user_data'],
                    'errors' => (object)[]
                ]);
                exit;
            }

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