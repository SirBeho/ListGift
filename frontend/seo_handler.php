<?php
// 1. CARGAR CONFIGURACIÓN (.env)
function getEnvValue($key, $default = "") {
    static $env = null;
    if ($env === null) {
        $env = file_exists(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
    }
    return $env[$key] ?? $default;
}

// 2. DATOS POR DEFECTO
$listId = $_GET['id'] ?? null;
$title = "ListGift - Tus listas de deseos";
$desc = "Crea y comparte tus listas de regalos de forma fácil.";
$metaImg = "https://listgift.free.nf/pictures/og-home.png";
$storageUrl = getEnvValue('VITE_STORAGE_URL', 'https://listgift.free.nf/uploads');

// 3. CONSULTA A LA DB
if ($listId) {
    try {
        $dsn = "mysql:host=".getEnvValue('DB_HOST').";dbname=".getEnvValue('DB_DATABASE').";charset=utf8mb4";
        $pdo = new PDO($dsn, getEnvValue('DB_USERNAME'), getEnvValue('DB_PASSWORD'), [
            PDO::ATTR_ERRMODE => PDO::EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        $stmt = $pdo->prepare("SELECT name, description, image FROM gift_lists WHERE id = ?");
        $stmt->execute([$listId]);
        $lista = $stmt->fetch();

        if ($lista) {
            $title = $lista['name'] . " | ListGift";
            $desc = $lista['description'] ?: $desc;
            $metaImg = $storageUrl . "/" . $lista['image'];
        }
    } catch (Exception $e) {
        // Si falla la DB, seguimos con los valores por defecto
    }
}

// 4. EL TRUCO PROFESIONAL: Leer el HTML de Vite e inyectar
if (file_exists(__DIR__ . '/index.html')) {
    $html = file_get_contents(__DIR__ . '/index.html');
    
    // Reemplazamos los tags genéricos por los dinámicos
    // Asegúrate de que en tu index.html original existan estos tags
    $html = preg_replace('/<title>.*?<\/title>/', "<title>" . htmlspecialchars($title) . "</title>", $html);
    
    // Inyectamos u Overwrite de Meta Tags
    $metaTags = "
    <meta name='description' content='" . htmlspecialchars($desc) . "' />
    <meta property='og:title' content='" . htmlspecialchars($title) . "' />
    <meta property='og:description' content='" . htmlspecialchars($desc) . "' />
    <meta property='og:image' content='" . $metaImg . "' />
    <meta property='og:type' content='website' />
    <meta name='twitter:card' content='summary_large_image' />";

    // Insertamos los tags justo antes del </head>
    $html = str_replace('</head>', $metaTags . "\n</head>", $html);

    echo $html;
} else {
    echo "Error: No se encontró el build de React (index.html).";
}