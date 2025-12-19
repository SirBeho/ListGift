<?php

namespace App\Modules\Item;

use App\Modules\List\Model as ListModel;
use Faker\Factory as FakerFactory;

class Factory
{
    public static function create($count = 25)
    {
        $faker = FakerFactory::create();
        $items = [];
        for ($i = 0; $i < $count; $i++) {
            $items[] = [

                'list_id' => ListModel::inRandomOrder()->value('id'),
                'name' => $faker->word(),               //nombre del articulo
                'price' => $faker->randomFloat(2, 1, 100), //precio del articulo
                'path' => $faker->url(),     //se supone que es el link del articulo pero ya con el nombre esta bien
                'place' => $faker->word(),         //nombre del lugar
                'place_link' => $faker->url(),  //link del lugar
                'description' => $faker->sentence(), //descripcion del articulo
                'img_name' => $faker->imageUrl(), //nombre de la imagen del articulo
                'status' => 0, //0=disponible, 1=regalado
                'user_id' => null, //id del usuario que lo regalo

            ];
        }
        return $items;
    }
}
