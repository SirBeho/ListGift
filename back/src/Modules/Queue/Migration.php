<?php

namespace App\Modules\Queue;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

class Migration
{
    public static function createTable()
    {
        Capsule::schema()->create('queues', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(); // Ejemplo de un campo
            $table->timestamps();
        });
    }

    public static function dropTable()
    {
        Capsule::schema()->dropIfExists('queues');
    }
}