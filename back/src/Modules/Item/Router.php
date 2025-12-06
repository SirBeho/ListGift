<?php

use App\Modules\Item\Controller;

$router->get('/items', Controller::class . '@index');
$router->get('/items/{id}', Controller::class . '@show');
$router->post('/items', Controller::class . '@store');
$router->put('/items/{id}', Controller::class . '@update');
$router->delete('/items/{id}', Controller::class . '@destroy');
$router->PATCH('/items/{id}', Controller::class . '@giftItem');