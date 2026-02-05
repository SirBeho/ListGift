<?php

$migrations = [
    "Roles" => "App\Modules\Role\Migration",
    "Users" => "App\Modules\User\Migration",
    "Listas" => "App\Modules\List\Migration",
    "Items" => "App\Modules\Item\Migration",
    "Subscriptions" => "App\Modules\Subscription\Migration",
];

/*
$nombresArchivosConNamespace = [];

foreach (scandir('src\Modules') as $archivo) {
    if ($archivo !== '.' && $archivo !== '..' ) {
        $nombresArchivosConNamespace[$archivo] = "App\\Modules\\Role\\Migration";
    }
}*/
