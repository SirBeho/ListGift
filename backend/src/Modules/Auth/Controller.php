<?php

namespace App\Modules\Auth;

use App\Modules\User\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Firebase\JWT\JWT;
use App\Modules\Auth\Controller;
use App\Utils\Validator;

class Controller
{
    public function login()
    {

        $validated = Validator::validate($_POST, [
            'username' => 'required',
            'password' => 'required',
        ]);

        try {

            $user = Model::where('username', $validated['username'])->first();

            if ($user && password_verify($validated['password'], $user->password)) {

                $user->load('lists');
                $key = $_ENV['JWT_SECRET'];

                $payload = [
                    'iss' => 'http://localhost',
                    'user' => $user->id,
                    //'role' => $user->role,
                    'iat' => time(),
                    'exp' => time() + 60 * 60
                ];

                $jwt = JWT::encode($payload, $key, 'HS256');

                http_response_code(200);
                http_response_code(200);
                setcookie('token', $jwt, [
                    'expires' => time() + 60 * 60,
                    'path' => '/',
                    'domain' => '',
                    'httponly' => true,
                    'samesite' => 'lax'
                ]);

                echo json_encode([
                    'status' => 'success',
                    'message' => '¡Bienvenido!',
                    'user' => $user,
                    'errors' => (object)[]
                ]);
                exit;
            } else {
                http_response_code(401);
                echo json_encode([
                    "status" => "error",
                    "message" => "El usuario o la contraseña no coinciden",
                    "errors" => []
                ]);
                exit;
            }
        } catch (\Throwable $th) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Error interno en el servidor",
                "errors" => ["server" => [$th->getMessage()]]
            ]);
        }
    }

    public function profile()
    {
        try {
            $user = Model::findOrFail($_REQUEST['auth']['user']);



            $user?->load('role', 'lists');

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
        setcookie('token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'domain' => null,
            'secure' => true,     // <--- Igual que en el login
            'httponly' => true,
            'samesite' => 'None'  // <--- Igual que en el login
        ]);
        header("HTTP/1.0 200 OK");
        echo json_encode(['status' => 'success', 'message' => 'Logout successful']);
    }
}
