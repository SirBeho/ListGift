<?php

use App\Modules\List\Controller; // Alias para evitar conflicto si hay otra clase Controller

$router->get('/lists', Controller::class . '@index');
$router->get('/lists/{id}', Controller::class . '@show');
$router->post('/lists', Controller::class . '@store');
$router->put('/lists/{id}', Controller::class . '@update');
$router->delete('/lists/{id}', Controller::class . '@destroy');