<?php

namespace App\Modules\Subscription;

use Faker\Factory as FakerFactory;

class Factory
{
    public static function create(int $count = 5): array
    {
        $faker = FakerFactory::create();
        $Subscriptions = [];
        for ($i = 0; $i < $count; $i++) {
            $Subscriptions[] = [
                'name' => $faker->word(), // Ejemplo para el campo 'name'
                // Otros campos de tu modelo usando $faker
            ];
        }
        return $Subscriptions;
    }
}