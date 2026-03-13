<?php

namespace App\Modules\Subscription;

use App\Middlewares\RoleAccess; // Considerar si esto debe ser configurable
use App\Modules\Subscription\Model as SubscriptionModel;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription as WebPushObject;

class Controller
{   
    public function subscribe() {
        $userId = $_REQUEST['auth']['user'] ?? null;
            
        if (!$userId) {
            http_response_code(401);
            echo json_encode(["error" => "No autorizado"]);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['endpoint'])) {
            //http_response_code(400);
            echo json_encode(["error" => "Datos incompletos"]);
            return;
        }

        // Guardamos o actualizamos la suscripción
        SubscriptionModel::updateOrCreate(
            ['endpoint' => $data['endpoint']],
            [
                'user_id' => $userId,
                'p256dh'  => $data['keys']['p256dh'],
                'auth'    => $data['keys']['auth']
            ]
        );

        echo json_encode(['status' => 'success', 'message' => 'Suscripción guardada con éxito']);
    }

    public static function  sendPush($userId, $title, $message , $url = '/') {
        // 1. Obtener todas las suscripciones de ese usuario desde la DB
        $subscription = SubscriptionModel::where('user_id', $userId)
            ->get();
               
        // 2. Configurar WebPush con tus llaves VAPID
        $auth = [
            'VAPID' => [
                'subject' => 'mailto:benjamin.tavarez.98@gmail.com',
                'publicKey'  => $_ENV['VAPID_PUBLIC_KEY'] ?? getenv('VAPID_PUBLIC_KEY'),
                'privateKey' => $_ENV['VAPID_PRIVATE_KEY'] ?? getenv('VAPID_PRIVATE_KEY'),
            ],
        ];
    
        try {
            $webPush = new WebPush($auth);
        } catch (\ErrorException $e) {
            error_log("❌ Error de llaves VAPID: " . $e->getMessage());
            return false; // <-- Agrega esto para salir de la función si falla
            // Esto te dirá si es un problema de OpenSSL o de formato
        }
    
        foreach ($subscription as $sub) {
               $webPush->queueNotification(
                WebPushObject::create([
                    'endpoint' => $sub->endpoint,
                    'publicKey' => $sub->p256dh,
                    'authToken' => $sub->auth,
                ]),
                json_encode(['title' => $title, 'body' => $message,'url'   => $url])
            );
        }
    
        // 3. Disparar todos los envíos
        // En SubscriptionController.php
        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getEndpoint();
            if ($report->isSuccess()) {
                error_log("✅ Notificación enviada con éxito a: $endpoint");
            } else {
                error_log("❌ Error al enviar a {$endpoint}: {$report->getReason()}");
                if ($report->isSubscriptionExpired()) {
                    SubscriptionModel::where('endpoint', $endpoint)->delete();
                    error_log("🗑️ Suscripción expirada borrada de la DB.");
                }
            }
        }
    }

    public function index()
    {
        try {
            $Subscriptions = Model::all();
            header("HTTP/1.0 200 OK");
            echo json_encode($Subscriptions);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function show($id)
    {
        try {
            $Subscription = Model::findOrFail($id);
            header("HTTP/1.0 200 OK");
            echo json_encode($Subscription);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Not Found");
            echo json_encode($th->getMessage());
        }
    }

    public function store()
    {
        try {
            RoleAccess::admin(); // Considerar si esto debe ser configurable

            if (Model::where('name', $_POST['name'])->exists()) {
                header("HTTP/1.0 409 Conflict");
                echo json_encode(['status' => 'error', 'message' => 'Subscription already exists']);
                return;
            }
            $Subscription = SubscribeModel::create($_POST);
            header("HTTP/1.0 201 Created");
            echo json_encode(['status' => 'success', 'message' => 'Subscription created successfully']);
        } catch (\Throwable $th) {
            header("HTTP/1.0 500 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function update($id)
    {
        try {
            RoleAccess::admin(); // Considerar si esto debe ser configurable
            $Subscription = Model::findOrFail($id);
            $Subscription->update($_POST);
            header("HTTP/1.0 200 OK");
            echo json_encode(['status' => 'success', 'message' => 'Subscription updated successfully']);
        } catch (ModelNotFoundException $th) {
            header("HTTP/1.0 404 Internal Server Error");
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            RoleAccess::admin(); // Considerar si esto debe ser configurable
            $Subscription = Model::findOrFail($id);
            $Subscription->delete();
            echo json_encode(['status' => 'success', 'message' => 'Subscription deleted successfully']);
        } catch (ModelNotFoundException $th) {
            echo json_encode(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }
}