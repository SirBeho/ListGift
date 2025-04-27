<?php

namespace App\Modules\List;

use Faker\Factory as FakerFactory;

class Factory
{
    public static function create(int $count = 5): array
    {
        $faker = FakerFactory::create();
        $Lists = [];
        for ($i = 0; $i < $count; $i++) {
            $Lists[] = [
                'name' => $faker->word(), 
                'user_id' => $faker->numberBetween(1, 3), // Assuming you have 3 users
            ];
        }
        return $Lists;
    }
}