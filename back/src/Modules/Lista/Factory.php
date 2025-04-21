<?php

namespace App\Modules\Item;

use Faker\Factory as FakerFactory;

class Factory
{
    public static function create($count = 5)
    {
        $faker = FakerFactory::create();
        $Items = [];
        for ($i = 0; $i < $count; $i++) {
            for ($j = 1; $j < 12; $j++) {
                $Items[] = [
                    'Item' => $faker->word(),
                    'subcategory_id' => $j,
                    'year' => 2025 + $i,
                    'user_id' => 2
                ];
            }
        }
        return $Items;
    }
}