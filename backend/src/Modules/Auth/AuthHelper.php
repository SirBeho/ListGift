<?php

namespace App\Modules\Auth;
use App\Modules\User\Model as UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
// En algún archivo de utilidades o en tu BaseController
class AuthHelper {
    public static function getCurrentUser() : ?UserModel {

        static $currentUser = null;
        if ($currentUser !== null) return $currentUser;

        
        $authData = $_REQUEST['auth'] ?? null;
        if (!$authData && isset($_COOKIE['token'])) {
            try {
                $decoded = JWT::decode($_COOKIE['token'], new Key($_ENV['JWT_SECRET'], 'HS256'));
                $authData = (array) $decoded;
            } catch (\Exception $e) {
               
                return null;
            }
        }

        if (isset($authData['user_id'])) {
            $currentUser = UserModel::find($authData['user_id'])->load('role', 'lists');
            return $currentUser;
        }

        //error_log("Usuario autenticado: " . print_r($user, true)); // Log para depuración

        return null;

        
    }
}
