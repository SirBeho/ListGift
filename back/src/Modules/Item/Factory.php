<?php

namespace App\Modules\Item;

use App\Modules\List\Model as ListModel;
use Faker\Factory as FakerFactory;

class Factory
{
    public static function create($count = 25)
    {
        $faker = FakerFactory::create();
        $countries = [];
        for ($i = 0; $i < $count; $i++) {
            $countries[] = [

                'list_id' => ListModel::inRandomOrder()->value('id'),
                'name' => $faker->word(),
                'price' => $faker->randomFloat(2, 1, 100),
                'path' => $faker->url(),
                'place' => $faker->word(),
                'place_link' => $faker->url(),
                'description' => $faker->sentence(),
                'img_name' => $faker->imageUrl(),
            ];
        }
        return $countries;
    }
}
