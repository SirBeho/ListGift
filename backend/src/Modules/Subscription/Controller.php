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
        $user_id = $_REQUEST['auth']['user_id'] ?? null;
            
        if (!$user_id) {
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
                'user_id' => $user_id,
                'p256dh'  => $data['keys']['p256dh'],
                'auth'    => $data['keys']['auth']
            ]
        );

        echo json_encode(['status' => 'success', 'message' => 'Suscripción guardada con éxito']);
    }

    public static function  sendPush($user_id, $title, $message , $url = '/') {
        // 1. Obtener todas las suscripciones de ese usuario desde la DB
        $subscription = SubscriptionModel::where('user_id', $user_id)
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
         
        } catch (\ErrorException $e) {
            error_log("❌ Error de llaves VAPID: " . $e->getMessage());
            return false; // <-- Agrega esto para salir de la función si falla
            // Esto te dirá si es un problema de OpenSSL o de formato
        }
    
       
    }

   
    
}