<?php

// user migragtion file

namespace App\Modules\List;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

class Migration
{
    public static function createTable()
    {
        Capsule::schema()->create('lists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('user_id');
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->boolean('is_public')->default(1);
            $table->date('due_date')->nullable();
            $table->string('image')->nullable();
            $table->string('color1')->default('#000000');
            $table->string('color2')->default('#000000');
            //itens con categorias
            $table->boolean('categorys')->default(0);
            $table->string('icon')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    public static function dropTable()
    {
        Capsule::schema()->dropIfExists('lists');
    }
}
