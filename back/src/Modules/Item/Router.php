<?php

use App\Modules\Item\Controller;


$router->get('/countries', Controller::class . '@index');
$router->get('/countries/{id}', Controller::class . '@show');
$router->post('/countries', Controller::class . '@store');
$router->put('/countries/{id}', Controller::class . '@update');
$router->delete('/countries/{id}', Controller::class . '@destroy');
