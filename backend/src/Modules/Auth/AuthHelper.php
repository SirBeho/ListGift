<?php

namespace App\Modules\Auth;
use App\Modules\User\Model as UserModel;

// En algún archivo de utilidades o en tu BaseController
class AuthHelper {
    public static function getCurrentUser() : ?UserModel {

        $userId = $_REQUEST['auth']['user_id'] ?? null;
        if (!$userId) return null;
        
        $user = UserModel::find($userId)->load('role', 'lists');

        //error_log("Usuario autenticado: " . print_r($user, true)); // Log para depuración

        return $user;

        
    }
}
