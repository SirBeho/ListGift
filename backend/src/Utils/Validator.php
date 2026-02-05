<?php

namespace App\Utils;

class Validator
{
    private static $dictionary = [
        'username' => 'Nombre de Usuario',
        'password' => 'Contraseña',
        'email'    => 'Correo Electrónico',
        'color1'   => 'Color Principal',
        'color2'   => 'Color Secundario',
        'name'     => 'Nombre',
        'description' => 'Descripción',
        'user_id'  => 'Identificador de Usuario',
        'list_id'  => 'Identificador de Lista',

    ];

    public static function validate($data, $rules, $customLabels = [])
    {
        $errors = [];
        $validated = [];

        if (array_key_exists('user_id', $rules) && !isset($data['user_id'])) {
            $data['user_id'] = $_REQUEST['auth']['user_data']['id'] ?? null;
        }

        foreach ($rules as $field => $ruleString) {
            $fieldRules = explode('|', $ruleString);
            $value = $data[$field] ?? null;
     
            $displayName = $customLabels[$field] 
                           ?? self::$dictionary[$field] 
                           ?? str_replace('_', ' ', ucfirst($field));

            foreach ($fieldRules as $rule) {
                // REQUERIDO: No puede ser nulo, ni vacío, ni solo espacios
                if ($rule === 'required' && (is_null($value) || $value === '')) {
                    $errors[$field][] = "El campo {$displayName} es obligatorio.";
                    continue; 
                }

                if ($rule === 'email' && !empty($value)) {
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $errors[$field][] = "El campo {$displayName} debe ser un correo electrónico válido.";
                    }
                }
                
                // NUMERIC: Asegura que el valor sea un número (entero o decimal)
                if ($rule === 'numeric' && !empty($value)) {
                    if (!is_numeric($value)) {
                        $errors[$field][] = "El campo {$displayName} debe ser un valor numérico.";
                    }else{
                        $value = $value + 0;
                    }
                }

                // Regla: Min
                if (strpos($rule, 'min:') === 0) {
                    $min = explode(':', $rule)[1];
                    if (strlen((string)$value) < $min) {
                        $errors[$field][] = "El campo {$displayName} debe tener al menos {$min} caracteres.";
                    }
                }

                // Regla: Hex (Para tus colores)
                if ($rule === 'hex' && !empty($value)) {
                    if (!preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $value)) {
                        $errors[$field][] = "El campo {$displayName} debe ser un color hexadecimal válido.";
                    }
                }

                // BOOLEANO: Asegura que sea 1, 0, true, false o "1", "0"
                if ($rule === 'boolean') {
                    if (!is_bool($value) && !in_array($value, [0, 1, '0', '1', true, false], true)) {
                        $errors[$field][] = "El campo {$displayName} debe ser booleano.";
                    }
                    $value = filter_var($value, FILTER_VALIDATE_BOOLEAN); // Lo convertimos a bool real
                }

                // FECHA: Verifica que sea una fecha válida
                if ($rule === 'date' && !empty($value)) {
                    $d = \DateTime::createFromFormat('Y-m-d', $value);
                    if (!$d || $d->format('Y-m-d') !== $value) {
                        $errors[$field][] = "La fecha no tiene un formato válido (AAAA-MM-DD).";
                    }
                }
            }
            $validated[$field] = $value;
        }

        if (!empty($errors)) {
            self::sendErrorResponse($errors);
        }

        return $validated;
    }

    private static function sendErrorResponse($errors)
    {
        http_response_code(422);
        echo json_encode([
            'status' => 'error',
            'message' => 'Los datos enviados no son válidos.',
            'errors' => $errors
        ]);
        exit();
    }
}