<?php

namespace App\Modules\Item;

use App\Modules\List\Model as ListModel;
use Faker\Factory as FakerFactory;
use App\Services\ImageManager;

class Factory
{
    public static function create2($count = 25)
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

    private static $categoryCache = [];
    

    public static function create($count = 25)
    {
        $faker = FakerFactory::create();
        $items = [];

        for ($i = 0; $i < $count; $i++) {
            echo "Procesando item " . ($i + 1) . " de $count... \r";
            // 1. Seleccionamos una Lista al azar de la Base de Datos
            $list = ListModel::inRandomOrder()->first();
            
            // Si no hay listas, paramos
            if (!$list) break; 

            // 2. Leemos el SLUG que guardamos en la descripción
            $categorySlug = $list->description; 
            
            // 3. Obtenemos un producto real de esa categoría
            $product = self::getProductFromApi($categorySlug);

            // 4. Descargamos la imagen (si hay producto)
            $imgName = $product ? ImageManager::downloadImage($product['thumbnail']) : 'git.png';

            $items[] = [
                'list_id'     => $list->id, // Vinculado a la lista correcta
                'name'        => $product ? $product['title'] : $faker->word(),
                'price'       => $product ? $product['price'] : $faker->randomFloat(2, 1, 100),
                'path'        => $faker->url(),
                'place'       => $product['brand'] ?? $faker->company(), // Marca real
                'place_link'  => $faker->url(),
                'description' => $product ? $product['description'] : $faker->sentence(),
                'img_name'    => $imgName,
                'status'      => 0,
                'user_id'     => null,
            ];

            
        }
        return $items;
    }

    private static function getProductFromApi($slug)
    {
        // Si el slug parece falso (generado por Faker), devolvemos null
        if (str_contains($slug, ' ')) return null;

        // Si ya consultamos esta categoría antes, usamos la memoria (Ahorra tiempo)
        if (isset(self::$categoryCache[$slug])) {
            $products = self::$categoryCache[$slug];
            return $products[array_rand($products)]; // Devolvemos uno al azar
        }

        // Si es nuevo, llamamos a la API
        $url = "https://dummyjson.com/products/category/" . $slug;
        $json = @file_get_contents($url);
        
        if ($json) {
            $data = json_decode($json, true);
            if (!empty($data['products'])) {
                // Guardamos en caché para la próxima vuelta del bucle
                self::$categoryCache[$slug] = $data['products'];
                return $data['products'][array_rand($data['products'])];
            }
        }

        return null;
    }

    
}
