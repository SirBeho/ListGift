<?php
$routes = ['index.php']; // Ajusta a tus rutas reales
foreach ($routes as $route) {
    $code = shell_exec("php -l backend/$route");
    if (strpos($code, "No syntax errors detected") === false) {
        echo "Error en ruta: $route";
        exit(1);
    }
}
echo "Todas las rutas básicas están bien.";