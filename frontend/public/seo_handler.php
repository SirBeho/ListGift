<?php
// 1. Obtener ID de la lista
$listId = isset($_GET['id']) ? intval($_GET['id']) : null;
$html = file_get_contents('index.html');

if ($listId) {
    // URL de tu API (ajusta si es local o producción)
    $apiUrl = "https://listgift.free.nf/backend/pub/lists/" . $listId;
    
    $context = stream_context_create([
        "http" => [
            "header" => "Accept: application/json\r\n",
            "timeout" => 2,
            "ignore_errors" => true // Importante para capturar el 403 sin que PHP de un Warning
        ]
    ]);
    
    $response = @file_get_contents($apiUrl, false, $context);
    $data = json_decode($response, true);

    if ($response && isset($data['status']) && $data['status'] === 'success') {
       
        
        
            $newTitle =  "ListGift | ". $data['name'] ;
            $newDesc  = $data['description'] ?: "Mira mi lista de regalos en ListGift.";
            $newUrl   = "https://listgift.free.nf/lists/" . $listId;
            $newImg   = isset($data['image']) ? "https://listgift.free.nf/backend/uploads/" . $data['image'] : "https://listgift.free.nf/pictures/og-home.png";

            // --- REEMPLAZO DINÁMICO ---
            
            // Título
            $html = preg_replace('/<title>.*?<\/title>/', "<title>$newTitle</title>", $html);
            
            // Meta Description estándar
            $html = preg_replace('/<meta name="description" content=".*?" \/>/', "<meta name=\"description\" content=\"$newDesc\" />", $html);

            // Open Graph (Facebook/WhatsApp)
            $html = preg_replace('/<meta property="og:title" content=".*?" \/>/', "<meta property=\"og:title\" content=\"$newTitle\" />", $html);
            $html = preg_replace('/<meta property="og:description" content=".*?" \/>/', "<meta property=\"og:description\" content=\"$newDesc\" />", $html);
            $html = preg_replace('/<meta property="og:image" content=".*?" \/>/', "<meta property=\"og:image\" content=\"$newImg\" />", $html);
            $html = preg_replace('/<meta property="og:url" content=".*?" \/>/', "<meta property=\"og:url\" content=\"$newUrl\" />", $html);

            // Twitter Cards
            $html = preg_replace('/<meta name="twitter:title" content=".*?" \/>/', "<meta name=\"twitter:title\" content=\"$newTitle\" />", $html);
            $html = preg_replace('/<meta name="twitter:description" content=".*?" \/>/', "<meta name=\"twitter:description\" content=\"$newDesc\" />", $html);
            $html = preg_replace('/<meta name="twitter:image" content=".*?" \/>/', "<meta name=\"twitter:image\" content=\"$newImg\" />", $html);
       
    }
}

// Entregar el HTML (modificado o el original si no hubo match)
echo $html;