<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use App\Config\DB;

require  __DIR__ . "/factories.php";
require "vendor/autoload.php";

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
