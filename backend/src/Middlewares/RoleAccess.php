<?php

namespace App\Middlewares;

class RoleAccess
{
    public static function admin()
    {
        $role = $_REQUEST['auth']['role_name'];


        if ($role !== 'Admin') {
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

        $role =  $auth_data['role_name'];
        $user_id =  intval($auth_data['user']);


        if ($role !== 'Admin' && $user_id !== intval($id)) {
            header("HTTP/1.0 403 Forbidden");
            echo json_encode([
                'status' => 'error',
                'message' => 'You do not have permission to access this resource'
            ]);
            exit();
        }
    }


}
