<?php

use App\Modules\Queue\Controller; // Alias para evitar conflicto si hay otra clase Controller

$router->get('/queues', Controller::class . '@index');
$router->get('/queues/{id}', Controller::class . '@show');
$router->post('/queues', Controller::class . '@store');
$router->put('/queues/{id}', Controller::class . '@update');
$router->delete('/queues/{id}', Controller::class . '@destroy');