<?php

namespace App\Services;


class NotificationWS
{
    public static function enviarWhatsApp($Item) {

       
      
        $token = "EAAm3u80FFswBQTCd7EZBeqQmA1Av8rBoDS2wiBoIvCbmXIydBb5a0rGPKZA3M43tAqrZAHiaQXQGVk1sZAr4PurJFjVtkaOYIWgTXeM6cj65GwaiI8xHLb1f3CPqUHgPxqhdVZCiQQqyg0JanALltZBVYmZA3pxuIu0WLPyubU2avmt9mT0HXZASvGPxuj5dEEKRSZB1oulcxYZAOQoR1Rrk1qqv3IdQHXOa7ZBmFDK6ImZABz4zrwB7PgUSCSXtjuZAEFsHZCBX3FMXFwAcEeuOZCZCrKhOvCFjNJ78uDCFnwsZD";
        $phoneId = "923533070846932"; // El ID largo, no el número de cel
        $url = "https://graph.facebook.com/v17.0/$phoneId/messages";
        $targetPhone = '18098892235';
    
        try {
            // Preparamos el cuerpo de la petición (Payload)
            $payload = [
                "messaging_product" => "whatsapp",
                "to" => $targetPhone,
                "type" => "template",
                "template" => [
                    "name" => "notificacion_regalo", // Asegúrate que el nombre coincida en Meta
                    "language" => ["code" => "es"],
                    "components" => [
                        [
                            "type" => "body",
                            "parameters" => [
                                ["type" => "text", "text" => $Item['name']],  // Variable {{1}}
                                ["type" => "text", "text" => $Item['price']], // Variable {{2}}
                                ["type" => "text", "text" => $Item['message'] ?? 'Felicidades'] // Variable {{3}}
                            ]
                        ],
                        // COMPONENTE 2: El botón con enlace dinámico
                        [
                            "type" => "button",
                            "sub_type" => "url", // Indica que es un botón de tipo enlace
                            "index" => "0",      // Es el primer botón de la plantilla (empieza en 0)
                            "parameters" => [
                                [
                                    "type" => "text", "text" => $Item['id_lista'] // La variable que se pega al final del link
                                ]
                            ]
                        ]
                    ]
                ]
            ];
    
            // Configuración de cURL
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "Authorization: Bearer $token",
                "Content-Type: application/json"
            ]);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Útil en localhost
    
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
            // Capturar errores de conexión cURL (ej. DNS, timeout)
            if (curl_errno($ch)) {
                throw new \Exception("Error de cURL: " . curl_error($ch));
            }
    
            curl_close($ch);
    
            $result = json_decode($response, true);
    
            // Validar si Meta devolvió un error (aunque el HTTP sea 400 o 500)
            if ($httpCode >= 400) {
                $errorMsg = $result['error']['message'] ?? 'Error desconocido en WhatsApp API';
                throw new \Exception("WhatsApp API Error ($httpCode): " . $errorMsg);
            }
    
            return [
                "success" => true,
                "message_id" => $result['messages'][0]['id'] ?? null
            ];
    
        } catch (\Exception $e) {
            // Aquí puedes registrar el error en un log local
            error_log("Error enviando WhatsApp: " . $e->getMessage());
            
            return [
                "success" => false,
                "error" => $e->getMessage()
            ];
        }
    }
}
