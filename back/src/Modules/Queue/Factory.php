<?php

namespace App\Modules\Queue;

use Faker\Factory as FakerFactory;

class Factory
{
    public static function create(int $count = 5): array
    {
        $faker = FakerFactory::create();
        $Queues = [];
        for ($i = 0; $i < $count; $i++) {
            $Queues[] = [
                'name' => $faker->word(), // Ejemplo para el campo 'name'
                // Otros campos de tu modelo usando $faker
            ];
        }
        return $Queues;
    }
}