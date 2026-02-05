<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use App\Config\DB;

require  __DIR__ . "/factories.php";
require "vendor/autoload.php";
require __DIR__ . "/../../Config/ENV.php";

DB::initialize();

$action = $argv[1] ?? "seed";
$factory = $argv[2] ?? null;

if ($factory) {
    $factory = strtolower($factory);
    if (isset($factories[$factory])) {
        executeFactory($factories[$factory], $action, $factory);
    } else {
        echo "Factory $factory not found. \n";
    }
} else {
    runFactories($action);
}

function runFactories($action)
{
    global $factories;

  
        clearUploads();
    

    foreach ($factories as $table => $config) {
        executeFactory($config, $action, $table);
    }
}

function executeFactory($config, $action, $table)
{
    switch ($action) {
        case "seed":
            seed($config, $table);
            break;
        case "refresh":
            refresh($config, $table);
            break;
        default:
            echo "Invalid action\n";
    }
}

function seed($config, $table)
{
    try {
        if (isset($config["data"]) && is_array($config["data"])) {

            foreach ($config["data"] as $item) {
                $factoryDefinition = $config["class"]::create(1)[0];
                $mergedItem = array_merge($factoryDefinition, $item);

                Capsule::table($table)->insert($mergedItem);
            }
            echo "Seeded specific data into $table.\n";
        }

        if (!isset($config["data"]) || isset($config["count"])) {
            $data = isset($config["count"]) ? $config["class"]::create($config["count"]) : $config["class"]::create();
            foreach ($data as $item) {
                Capsule::table($table)->insert($item);
            }
            echo "Seeded ramdom data into $table \n";
        }
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}

function refresh($factory, $table)
{
    try {
        Capsule::table($table)->truncate();
        seed($factory, $table);
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}

function clearUploads()
{
    // Calculamos la ruta: sube 2 niveles desde donde está este script hacia /public/uploads
    $dir = __DIR__ . "/../../../public/uploads/";

    if (is_dir($dir)) {
        $files = glob($dir . 'prod_*'); // Buscamos solo los archivos que empiezan con 'prod_'
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file); // Borrar el archivo físico
            }
        }
        echo "✅ Uploads folder cleaned.\n";
    } else {
        echo "⚠️  Uploads directory not found at: $dir\n";
    }
}