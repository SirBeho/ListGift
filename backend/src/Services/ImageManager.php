<?php

namespace App\Services;


class ImageManager
{
    // Ruta absoluta hacia la carpeta de almacenamiento
    private static $uploadPath = __DIR__ . '/../../public/uploads';

    /**
     * Proceso principal: Valida, Nombra y Convierte a WebP
     */
    public static function upload($file, $prefix = 'img')
    {
        // 1. Validar que el archivo existe y no tiene errores de subida
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }
    
        // 2. Asegurar que la carpeta de destino existe
        if (!is_dir(self::$uploadPath)) {
            mkdir(self::$uploadPath, 0777, true);
        }
    
        // 3. Validar formato por MIME type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array($file['type'], $allowedTypes)) {
            throw new \Exception("Formato de archivo no permitido. Usa JPG, PNG, GIF o WebP.");
        }
    
        // 4. Validar tamaño (Máximo 2MB)
        $maxSize = 2 * 1024 * 1024; 
        if ($file['size'] > $maxSize) {
            throw new \Exception("La imagen es demasiado pesada (Máx 2MB).");
        }
    
        // 5. Obtener el siguiente nombre secuencial (ej: list_10001.webp)
        $imageName = self::getNextImageName(self::$uploadPath, $prefix);
        $destination = self::$uploadPath . '/' . $imageName;
    
        // 6. Procesar la imagen según su tipo original
        $tmpPath = $file['tmp_name'];
        $info = getimagesize($tmpPath);
        
        if (!$info) {
            throw new \Exception("El archivo no es una imagen válida.");
        }
    
        $mime = $info['mime'];
    
        // Crear recurso de imagen GD
        switch ($mime) {
            case 'image/jpeg': $img = imagecreatefromjpeg($tmpPath); break;
            case 'image/png':  $img = imagecreatefrompng($tmpPath); break;
            case 'image/webp': $img = imagecreatefromwebp($tmpPath); break;
            case 'image/gif':  $img = imagecreatefromgif($tmpPath); break;
            default: 
                throw new \Exception("Formato $mime no soportado.");
        }
    
        if ($img) {
            // 7. Preparar para WebP (Soporte para transparencias y color real)
            imagepalettetotruecolor($img);
            imagealphablending($img, true);
            imagesavealpha($img, true);
    
            // 8. Guardar como WebP con calidad 90
            $saved = imagewebp($img, $destination, 90);
            imagedestroy($img); // Liberar memoria RAM inmediatamente
    
            if ($saved) {
                return $imageName; // Retornamos el nombre para la DB
            } else {
                throw new \Exception("Error al procesar y guardar la imagen en el servidor.");
            }
        }
    
        return null;
    }
    /**
     * Lógica de nombres secuenciales (Empieza en 10000)
     */
    private static function getNextImageName(string $directory, string $prefix): string 
    {
        // Escaneamos buscando archivos que coincidan con el prefijo
        $files = glob($directory . "/" . $prefix . "_*.webp");
        
        $numbers = [10000]; // Valor base inicial
        
        foreach ($files as $file) {
            $fileName = basename($file);
            // Extraemos el número mediante Regex: "list_10005.webp" -> 10005
            if (preg_match('/' . $prefix . '_(\d+)\.webp$/', $fileName, $matches)) {
                $numbers[] = (int)$matches[1];
            }
        }

        $nextNumber = max($numbers) + 1;
        return $prefix . "_" . $nextNumber . ".webp";
    }

    /**
     * Eliminar imagen física (Útil al editar o borrar registros)
     */
    public static function delete($fileName)
    {
        if (!$fileName || $fileName === 'default.png') return;
        
        $filePath = self::$uploadPath . '/' . $fileName;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public static function downloadImage($url, $prefix = 'prod')
    {
        if (!$url) return '';

        // 1. Definir ruta (Subiendo niveles según tu estructura)
        $targetDir = dirname(__DIR__, 2) . '/public/uploads/'; 
        
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $fileName = self::getNextImageName($targetDir, $prefix); 
        $fullPath = $targetDir . $fileName;

        // 3. Descarga física del contenido
        $content = @file_get_contents($url);
        if (!$content) return '';

        // 4. PROCESAMIENTO GD (Conversión a WebP)
        // Usamos imagecreatefromstring para que no importe si DummyJSON envía PNG o JPG
        $img = @imagecreatefromstring($content);
        
        if ($img) {
            // Asegurar compatibilidad con transparencias
            imagepalettetotruecolor($img);
            imagealphablending($img, true);
            imagesavealpha($img, true);

            // Guardar como WebP optimizado
            $success = imagewebp($img, $fullPath, 90);
            imagedestroy($img); // Liberar memoria

            if ($success) {
                return $fileName;
            }
        }

        return 'default.webp'; 
    }

    public static function getImageForCategory(string $categoryName, string $color2 = '000000'): string
    {
        $bg_color =  ltrim($color2, '#');
        $textForImage = urlencode($categoryName);
        $fakeImageUrl = "https://dummyjson.com/image/600x400/{$bg_color}/ffffff?text={$textForImage}&fontSize=35";

        // 3. Descargamos y procesamos la imagen físicamente
        // Esta función retornará algo como "list_10001.webp"
        $imgName = ImageManager::downloadImage($fakeImageUrl, 'list');

        return $imgName;
    }
}