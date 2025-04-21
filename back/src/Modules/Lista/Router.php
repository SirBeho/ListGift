<?php

use App\Modules\Item\Controller;

$router->get('/Items', Controller::class . '@index');
$router->get('/report', Controller::class . '@report');
$router->get('/report/{id}', Controller::class . '@report');
$router->post('/Items', Controller::class . '@store');
$router->put('/Items/{id}', Controller::class . '@update');
$router->delete('/Items/{id}', Controller::class . '@destroy');
$router->get('/compasses', Controller::class . '@listcompasses');
