<?php

use App\Modules\Subscription\Controller; // Alias para evitar conflicto si hay otra clase Controller


$router->post('/subscription/subscribe',  Controller::class . '@subscribe');

$router->get('/subscriptions', Controller::class . '@index');
$router->get('/subscriptions/{id}', Controller::class . '@show');
$router->post('/subscriptions', Controller::class . '@store');
$router->put('/subscriptions/{id}', Controller::class . '@update');
$router->delete('/subscriptions/{id}', Controller::class . '@destroy');
