<?php

namespace App\Services;

use Pusher\Pusher;

class RealtimeService
{   
    public static function PublishPusher($Item) {
        try {
           // RoleAccess::admin(); // Considerar si esto debe ser configurable
            
            $pusher = new \Pusher\Pusher(
                $_ENV['PUSHER_KEY'], 
                $_ENV['PUSHER_SECRET'],
                $_ENV['PUSHER_APP_ID'],
                [
                    'cluster' => $_ENV['PUSHER_CLUSTER'], 
                    'useTLS' => false,
                    'verify_ssl' => false  // Desactivar la verificación SSL
                ]
            );

            $data = $Item->toArray();

            $pusher->trigger('list-gifts', 'item-gifted', $data);

        } catch (\Throwable $th) {
            error_log("Pusher Error: " . $th->getMessage());
  
        }
        
    }
}
