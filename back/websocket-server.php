<?php
// D:\PROJECTOS\Personales\ListGist\back\websocket-server.php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use React\EventLoop\Factory;
use React\Socket\Server;
use Illuminate\Database\Capsule\Manager as Capsule; // Para usar tu conexión DB
use App\Config\DB;

// 💡 Clase para el servidor Ratchet
class RealtimeWebSocketServer implements MessageComponentInterface {
    protected $clients;
    private $db; // Para almacenar la conexión PDO/Capsule

    DB::initialize();
    
    public function __construct(Capsule $db) {
        $this->clients = new \SplObjectStorage;
        $this->db = $db;
    }
    
    // Método para ser llamado desde el temporizador
    public function pollDatabase() {
        // 🚨 1. Ejecutar la consulta de polling a MySQL
        try {
            // Usamos Capsule para la consulta (asumiendo que tu DB está configurada en la App\Config\DB)
            $events = $this->db->table('queue')->where('is_sent', 0)->get();
            
            if ($events->isNotEmpty()) {
                
                foreach ($events as $event) {
                    $payload = json_decode($event->payload, true);
                    
                    // 2. Enviar el mensaje a todos los clientes conectados
                    $this->sendNotification($payload);
                    
                    // 3. Marcar como enviado (Crucial para no re-enviar)
                    $this->db->table('queue')->where('id', $event->id)->update(['is_sent' => 1]);
                    
                    echo "Evento enviado y marcado como consumido: {$event->id}\n";
                }
            }
        } catch (\Throwable $e) {
            echo "Error de Polling/DB: {$e->getMessage()}\n";
        }
    }

    public function onOpen(ConnectionInterface $conn) { $this->clients->attach($conn); echo "Cliente conectado ({$conn->resourceId})\n"; }
    public function onClose(ConnectionInterface $conn) { $this->clients->detach($conn); echo "Cliente desconectado ({$conn->resourceId})\n"; }
    public function onError(ConnectionInterface $conn, \Exception $e) { echo "Error: {$e->getMessage()}\n"; $conn->close(); }
    public function onMessage(ConnectionInterface $from, $msg) { /* No es necesario para este caso */ }
    
    public function sendNotification(array $payload) {
        $jsonPayload = json_encode($payload);
        foreach ($this->clients as $client) {
            $client->send($jsonPayload);
        }
    }
}


// =================================================================
// 3. INICIAR LA CONEXIÓN DB Y EL SERVIDOR
// =================================================================

require 'ENV.php';
// 💡 Cargar tus variables de entorno aquí (ya tienes el código en tu runner)
// require 'ruta/a/la/carga_de_dotenv.php'; 

// 💡 Inicializar tu ORM Capsule (Usando la lógica de App\Config\DB::initialize)
// Asumiendo que esta inicialización retorna la instancia de Capsule o la hace accesible globalmente
$db = new Capsule; 
// ... (Aquí iría tu código de Capsule::addConnection, setAsGlobal, bootEloquent) ...

// 1. Inicializar el Bucle de Eventos
$loop = Factory::create();

// 2. Instanciar el Servidor de WebSockets, pasándole la conexión DB
$realtimeServer = new RealtimeWebSocketServer($db);

// 3. 🚨 Configurar el Polling (Consulta cada 2 segundos)
$loop->addPeriodicTimer(2, function () use ($realtimeServer) {
    $realtimeServer->pollDatabase();
});


// 4. Inicializar Ratchet
$socket = new Server('0.0.0.0:8080', $loop); 
$server = new IoServer(
    new HttpServer(new WsServer($realtimeServer)), 
    $socket, 
    $loop
);

echo "Servidor WebSocket iniciado. Polling MySQL cada 2 segundos. Puerto 8080\n";
$server->run();