<?php

namespace App\Modules\Auth;

use App\Modules\User\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Firebase\JWT\JWT;
use App\Modules\Auth\Controller;


class Controller
{
    
      
    public function login()
    {

        try {

            $user = Model::where('username', $_POST['username'])->first();
              
            if (!$user) {
                header("HTTP/1.0 401 Unauthorized");
                echo json_encode(['status' => 'error', 'message' => 'Invalid Username']);
                return;
            }

            
            //$user->load('role');
            if ($user && password_verify($_POST['password'], $user->password)) {
                $key = $_ENV['JWT_SECRET'];

                $payload = [
                    'iss' => 'http://localhost',
                    'user' => $user->id,
                    //'role' => $user->role,
                    'iat' => time(),
                    'exp' => time() + 60 * 60
                ];

                $jwt = JWT::encode($payload, $key, 'HS256');

                header("HTTP/1.0 200 OK");
                setcookie('token', $jwt, [
                    'expires' => time() + 60 * 60,
                    'path' => '/',
                    'domain' => '',
                    'httponly' => true,
                    'samesite' => 'lax'
                ]);
              
                echo json_encode(['status' => 'success', 'message' => 'Login successful']);
            } else {
                header("HTTP/1.0 401 Unauthorized");
                echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
            }
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function profile()
    {
        try {
            $user = Model::findOrFail($_REQUEST['auth']['user']);
            
            

            $user->load('role','lists');

            header("HTTP/1.0 200 OK");
            echo json_encode(['status' => 'success', 'user' => $user]);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Not Found");
            echo json_encode($th->getMessage());
        }
    }

    public function updatePassword()
    {
        try {
            $user = Model::findOrFail($_REQUEST['auth']['user']);

            if (!password_verify($_POST['old_password'], $user->password)) {

                header("HTTP/1.0 401 Unauthorized");
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid old password',
                ]);
                return;
            }

            $user->password = password_hash($_POST['new_password'], PASSWORD_DEFAULT);
            $user->save();

            header("HTTP/1.0 200 OK");
            echo json_encode(['status' => 'success', 'message' => 'Password updated successfully']);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Not Found");
            echo json_encode($th->getMessage());
        }
    }

    public function logout()
    {
        setcookie('token', '', time() - 3600, '/', '', false, true);
        header("HTTP/1.0 200 OK");
        echo json_encode(['status' => 'success', 'message' => 'Logout successful']);
    }
}
