<?php
// 1. Función ligera para leer el .env sin colapsar el servidor
function getEnvData($key, $default = null) {
    static $config = null;
    if ($config === null) {
        $config = [];
        if (file_exists('./backend/.env')) {
            $lines = file('./backend/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                list($name, $value) = explode('=', $line, 2);
                $config[trim($name)] = trim($value);
            }
        }
    }
    return $config[$key] ?? $default;
}

$listId = isset($_GET['id']) ? intval($_GET['id']) : null;
$html = file_get_contents('index.html');

if ($listId) {
    try {
        // 2. Usar los datos de tu .env directamente
        $host = getEnvData('DB_HOST');
        $db   = getEnvData('DB_DATABASE');
        $user = getEnvData('DB_USERNAME');
        $pass = getEnvData('DB_PASSWORD');

        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
        
        $stmt = $pdo->prepare("SELECT name, description, image, is_public FROM lists WHERE id = ? LIMIT 1");
        $stmt->execute([$listId]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data && (int)$data['is_public'] === 1) {
       
            $newTitle =  "ListGift | ". $data['name'] ;
            $newDesc  = $data['description'] ?: "Mira mi lista de regalos en ListGift.";
            $newUrl   = "https://listgift.free.nf/lists/" . $listId;
            $newImg   = isset($data['image']) ? "https://listgift.free.nf/backend/uploads/" . $data['image'] : "https://listgift.free.nf/pictures/og-home.png";

            // --- REEMPLAZO DINÁMICO ---
            $html = preg_replace('/<title>.*?<\/title>/i', "<title>$newTitle</title>", $html);
            $html = preg_replace('/<meta\s+name="description"\s+content=".*?"\s*\/?>/s', '<meta name="description" content="' . $newDesc . '" />', $html);
            
            // Open Graph (Facebook/WhatsApp)
            $html = preg_replace('/<meta property="og:title" content=".*?" \/>/', "<meta property=\"og:title\" content=\"$newTitle\"Benja />", $html);
            $html = preg_replace('/<meta property="og:description" content=".*?"\s*\/?>/i', "<meta property=\"og:description\" content=\"$newDesc\" />", $html);
            $html = preg_replace('/<meta property="og:image" content=".*?" \/>/', "<meta property=\"og:image\" content=\"$newImg\" />", $html);
            $html = preg_replace('/<meta property="og:url" content=".*?" \/>/', "<meta property=\"og:url\" content=\"$newUrl\" />", $html);

            // Twitter Cards
            $html = preg_replace('/<meta name="twitter:title" content=".*?" \/>/', "<meta name=\"twitter:title\" content=\"$newTitle\" />", $html);
            $html = preg_replace('/<meta name="twitter:description" content=".*?" \/>/', "<meta name=\"twitter:description\" content=\"$newDesc\" />", $html);
            $html = preg_replace('/<meta name="twitter:image" content=".*?" \/>/', "<meta name=\"twitter:image\" content=\"$newImg\" />", $html);
       
   }
    } catch (Exception $e) {
        echo ($e);
        die("fin 2");
    }
}

header('Content-Type: text/html; charset=utf-8');
echo $html;