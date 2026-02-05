<?php

namespace App\Modules\List;
use App\Services\ImageManager;
use Faker\Factory as FakerFactory;


class Factory
{   
    const ICONS = ['cake', 'gift', 'party', 'wine', 'heart', 'gem', 'baby', 'star', 'home', 'school', 'travel', 'photo', 'game', 'music', 'gym', 'food'];

    public static function create2(int $count = 5): array
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
                'icon' => $faker->randomElement(self::ICONS)
            ];
        }
        return $Lists;
    }

    public static function create(int $count = 5): array
    {
        $faker = FakerFactory::create();
        $Lists = [];

        // 1. Obtenemos las categorías reales
        // Usamos @ para evitar errores fatales si falla internet
        $json = @file_get_contents('https://dummyjson.com/products/categories');
        $categories = $json ? json_decode($json, true) : [];
        shuffle($categories);
        $random_categories = array_slice($categories, 0, $count);
        // Si la API falla o pedimos más listas de las que existen, rellenamos con Faker

       
        
        for ($i = 0; $i < $count; $i++) {
            echo "Procesando Lista " . ($i + 1) . " de $count... \r";
            // Intentamos sacar una categoría real del array
            $realCategory = $random_categories[$i] ?? null;
            $color2 = $faker->hexColor();
            $imageUrl = ImageManager::getImageForCategory($realCategory ? $realCategory['name'] : $faker->word() ,$color2);

            $Lists[] = [
                // AQUÍ ESTÁ LA CLAVE:
                'name'        => $realCategory ? $realCategory['name'] : $faker->word(),
                'description' => $realCategory ? $realCategory['slug'] : $faker->slug(), // Guardamos el SLUG aquí
                'user_id'     => $faker->numberBetween(1, 2),
                'status'      => $faker->randomElement(['active', 'inactive']),
                'is_public'   => $faker->randomElement([true, true, false]),
                'due_date'    => $faker->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
                'image'       => $imageUrl, 
                'color1'      => $faker->hexColor(), 
                'color2'      => $color2,
                'categorys'   => $faker->boolean(),
                'icon'        => $faker->randomElement(self::ICONS)
            ];
        }
        return $Lists;
    }

    
}
