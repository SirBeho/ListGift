<?php

use App\Config\DB;


require __DIR__ . "/migrations.php";
require "./vendor/autoload.php";

require __DIR__ . "/../../Config/ENV.php";

DB::initialize();


$action = $argv[1] ?? "up";
$migration = $argv[2] ?? null;

if ($migration) {

    $migration = ucfirst($migration);
    if (isset($migrations[$migration])) {
        executeMigration($migrations[$migration], $action);
    } else {
        echo "Migration $migration not found. \n";
    }
} else {

    runMigrations($action);
}

function runMigrations($action)
{
    global $migrations;



    // if action is down, reverse the order of migrations
    if ($action === "down") {
        $migrations = array_reverse($migrations);
    }


    if (validateMigration($action)) {

        if ($action == "refresh") {

            foreach (array_reverse($migrations) as $migration => $class) {
                executeMigration($class, "down");
            }

            $action = "up";
        }

        foreach ($migrations as $migration => $class) {
            executeMigration($class, $action);
        }
    }

}


function validateMigration($action)
{
    try {

        $pdo = new PDO("mysql:host=" . $_ENV['DB_HOST'], $_ENV['DB_USERNAME'] ?? '', $_ENV['DB_PASSWORD'] ?? '');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Verificar si la base de datos existe
        $stmt = $pdo->prepare("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = :database");
        $stmt->bindParam(':database', $_ENV['DB_DATABASE']);
        $stmt->execute();

        if ($action == 'db' && $stmt->rowCount() > 0) {
            echo "La base de datos '" . $_ENV['DB_DATABASE'] . "' ya existe.\n";
        } elseif ($action == 'db') {
            // Crear la base de datos
            $pdo->exec("CREATE DATABASE `" . $_ENV['DB_DATABASE'] . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            echo "Base de datos '" . $_ENV['DB_DATABASE'] . "' creada exitosamente.\n";
        } elseif ($stmt->rowCount() == 0) {
            echo "La base de datos '" . $_ENV['DB_DATABASE'] . "' no existe. Para crearla, ejecuta el comando con el argumento 'db'.\n";
            exit(1);
        }

        $pdo = new PDO("mysql:host=" . $_ENV['DB_HOST'] . ";dbname=" . $_ENV['DB_DATABASE'] . ";charset=utf8mb4", $_ENV['DB_USERNAME'] ?? '', $_ENV['DB_PASSWORD'] ?? '');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "Conexión a la base de datos '" . $_ENV['DB_DATABASE'] . "' establecida.\n";

        return true;


    } catch (PDOException $e) {
        die("Error al conectar o crear la base de datos: " . $e->getMessage() . "\n");
    }
}

function executeMigration($migration, $action)
{

    switch ($action) {
        case "up":
        case "db":
            up($migration);
            break;
        case "down":
            down($migration);
            break;
        case "refresh":
            refresh($migration);
            break;
        default:
            echo "Invalid action";
    }
}

function up($migration)
{
    try {
        $migration::createTable();
        echo "Table created successfully \n";
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}

function down($migration)
{
    try {
        $migration::dropTable();
        echo "Table dropped successfully \n";
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}

function refresh($migration)
{
    try {

        $migration::dropTable();
        $migration::createTable();
        echo "Table refreshed successfully \n";
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage();
    }

}
