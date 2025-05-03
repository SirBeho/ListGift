<?php

namespace App\Middlewares;

class RoleAccess
{
    public static function admin()
    {
        $role = (array) $_REQUEST['auth']['role'];

        echo json_encode($role);
        exit();


        if ($role['name'] !== 'Admin') {
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
        exit();
        
        $role = (array) $_REQUEST['auth']['role'];
        $user =  intval($_REQUEST['auth']['user']);

        if ($role['name'] !== 'Admin' && $user !== intval($id)) {
            header("HTTP/1.0 403 Forbidden");
            echo json_encode([
                'status' => 'error',
                'message' => 'You do not have permission to access this resource'
            ]);
            exit();
        }
    }

    
}
