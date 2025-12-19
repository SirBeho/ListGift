<?php

namespace App\Modules\User;

use App\Modules\Role\Model as RoleModel;
use Faker\Factory as FakerFactory;

class Factory
{
    public static function create($count = 5)
    {
        $faker = FakerFactory::create();
        $users = [];
        for ($i = 0; $i < $count; $i++) {
            $users[] = [
                'role_id' => RoleModel::where('id', '<>', 1)->inRandomOrder()->value('id'),
                'name' => $faker->name,
                'username' => $faker->userName,
                'password' => password_hash($faker->password, PASSWORD_BCRYPT),
                'status' => 1,
            ];
        }
        return $users;
    }
}
