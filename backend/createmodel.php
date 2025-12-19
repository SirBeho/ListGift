<?php

// Asegurarse de que el script se ejecute desde la línea de comandos
if (php_sapi_name() !== 'cli') {
    exit("Este script debe ser ejecutado desde la línea de comandos.\n");
}

// Obtener el nombre del modelo como argumento
if (!isset($argv[1])) {
    exit("Uso: php createmodel.php [NombreModelo]\n");
}

$ModelNameRaw = $argv[1];
$ModelName = ucfirst($ModelNameRaw);
$moduleDirectory = 'src/modules/' . $ModelName;

$variables = [
    'ModelName' => $ModelName,
    'ModelVariablePlural' => ucfirst(strtolower(preg_replace('/(?<!^)(?=[A-Z])/', '_', $ModelName)) . 's'),
    'tableName' => strtolower(preg_replace('/(?<!^)(?=[A-Z])/', '_', $ModelName)) . 's',
    'modelSlugPlural' => strtolower(preg_replace('/(?<!^)(?=[A-Z])/', '-', $ModelName)) . 's',
];

// Crear el directorio del módulo si no existe
if (!is_dir($moduleDirectory)) {
    if (mkdir($moduleDirectory, 0755, true)) {
        echo "Módulo {$ModelName} creado en: {$moduleDirectory}\n";
    } else {
        exit("Error al crear el directorio del módulo {$moduleDirectory}\n");
    }
} else {
    exit("El módulo {$ModelName} ya existe.\n");
}


// Función para generar el contenido de los archivos basados en plantillas
function generateFileContent(string $stubPath, array $replacements): string
{
    if (!file_exists($stubPath)) {
        exit("Error: No se encontró la plantilla en {$stubPath}\n");
    }
    $content = file_get_contents($stubPath);
    foreach ($replacements as $search => $replace) {
        $content = str_replace('{{ ' . $search . ' }}', $replace, $content);

    }
    return $content;
}


// Generar Controller
try {
    $controllerStubPath = __DIR__ . '/stubs/controller.stub';
    $controllerContent = generateFileContent($controllerStubPath, $variables);
    file_put_contents($moduleDirectory . '/Controller.php', $controllerContent);
    echo "Controller.php para {$ModelName} creado.\n";
} catch (Exception $e) {
    exit("Error al crear el Controller: " . $e->getMessage() . "\n");
}

// Generar Factory
try {
    $factoryStubPath = __DIR__ . '/stubs/factory.stub';
    $factoryContent = generateFileContent($factoryStubPath, $variables);
    file_put_contents($moduleDirectory . '/Factory.php', $factoryContent);
    echo "Factory.php para {$ModelName} creada.\n";
} catch (Exception $e) {
    exit("Error al crear el Factory: " . $e->getMessage() . "\n");
}

// Generar Migration
try {
    $migrationStubPath = __DIR__ . '/stubs/migration.stub';
    $migrationContent = generateFileContent($migrationStubPath, $variables);
    file_put_contents($moduleDirectory . '/Migration.php', $migrationContent);
    echo "Migration.php para {$ModelName} creada.\n";
} catch (Exception $e) {
    exit("Error al crear la Migration: " . $e->getMessage() . "\n");
}

// Generar Model
try {
    $modelStubPath = __DIR__ . '/stubs/model.stub';
    $modelContent = generateFileContent($modelStubPath, $variables);
    file_put_contents($moduleDirectory . '/Model.php', $modelContent);
    echo "Modelo.php para {$ModelName} creado.\n";
} catch (Exception $e) {
    exit("Error al crear el Model: " . $e->getMessage() . "\n");
}

// Generar Router
try {
    $routerStubPath = __DIR__ . '/stubs/router.stub';
    $routerContent = generateFileContent($routerStubPath, $variables);
    file_put_contents($moduleDirectory . '/Router.php', $routerContent);
    echo "Router.php para {$ModelName} creado.\n";
} catch (Exception $e) {
    exit("Error al crear el Router: " . $e->getMessage() . "\n");
}

echo "Estructura del módulo {$ModelName} generada.\n";
