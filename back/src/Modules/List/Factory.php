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
                'user_id' => $faker->numberBetween(1, 2), // Assuming you have 3 users
                'description' => $faker->sentence(),
                'status' => $faker->randomElement(['active', 'inactive']),
                'is_public' => $faker->boolean(),
                'due_date' => $faker->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
                'image' => 'https://picsum.photos/640/480',
                'color1' => $faker->hexColor(),
                'color2' => $faker->hexColor(),
                'categorys' => $faker->boolean(),
                'icon' => $faker->word()
            ];
        }
        return $Lists;
    }
}