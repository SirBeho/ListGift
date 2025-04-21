<?php

namespace App\Modules\Item;

use Faker\Factory as FakerFactory;

class Factory
{
    public static function create($count = 5)
    {
        $faker = FakerFactory::create();
        $countries = [];
        for ($i = 0; $i < $count; $i++) {
            $countries[] = [
                'name' => $faker->Item(),
            ];
        }
        return $countries;
    }
}
