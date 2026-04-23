<?php

namespace App\Middlewares;

use App\Modules\Auth\AuthHelper;
use App\Modules\List\Model;

class RoleAccess
{
    public static function admin()
    {
        $role = $_REQUEST['auth']['role_id'];

        if ($role !== 1) {
            header("HTTP/1.0 403 Forbidden");
            echo json_encode([
                'status' => 'error',
                'message' => 'You do not have permission to access this resource'
            ]);
            exit();
        }
    }

    public static function adminOrOwner($id)
    {

        $auth_data = $_REQUEST['auth'] ?? null;

        // Si no hay datos de autenticación, el token no fue enviado o es inválido.
        if (!$auth_data) {
            header("HTTP/1.0 401 Unauthorized");
            echo json_encode(['status' => 'error', 'message' => 'Token not provided or invalid']);
            exit();
        }

        $role =  $auth_data['role_id'];
        $user_id =  intval($auth_data['user_id']);


        if ($role !== 1 && $user_id !== intval($id)) {
            header("HTTP/1.0 403 Forbidden");
            echo json_encode([
                'status' => 'error',
                'message' => 'You do not have permission to access this resource'
            ]);
            exit();
        }
    }

    public static function checkOwner(Model $resource) 
{
    // Usamos el helper optimizado que busca en Request o Cookie
    $user = AuthHelper::getCurrentUser();

    if (!$user) {
        self::error(401, "Inicia sesión para continuar");
    }

    // El Admin (Role 1) siempre pasa
    if ($user->role_id === 1) return true;

    // Verificamos si el usuario es el dueño del recurso (lista, regalo, etc.)
    if (intval($user->id) !== intval($resource->user_id)) {
        self::error(403, "No tienes permiso para este recurso");
    }

    return true;
}

private static function error($code, $msg) {
    header("HTTP/1.0 $code");
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}


}
