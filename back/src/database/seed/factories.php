<?php

$factories =  [
    "roles" => [
        "class" => "App\Modules\Role\Factory",
    ], 
    "users" => [
        "class" => "App\Modules\User\Factory",
        "count" => 3,
        "data" => [
            [
                'name' => 'Benjamin Tavarez',
                'username' => 'benjamin000',
                'password' => password_hash('1234', PASSWORD_BCRYPT),
                'status' => 1,
                'role_id' => 1,
            ],
        ],
    ],
    "lists" => [
        "class" => "App\Modules\List\Factory",
        "count" => 8,
    ],
    "items" => [
        "class" => "App\Modules\Item\Factory",
    ],
];