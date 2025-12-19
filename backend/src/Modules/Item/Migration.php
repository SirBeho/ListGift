<?php

// user migragtion file

namespace App\Modules\Item;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

class Migration
{
    public static function createTable()
    {
        Capsule::schema()->create('items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('list_id');
            $table->string('name');
            $table->string('price');
            $table->string('path');
            $table->string('place');
            $table->string('place_link');
            $table->string('description');
            $table->string('img_name');
            $table->integer('status')->default(0);
            $table->unsignedBigInteger('user_id')->default(0)->nullable();
            $table->string('message')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('list_id')->references('id')->on('lists');
            $table->timestamps();
        });
    }

    public static function dropTable()
    {
        Capsule::schema()->dropIfExists('items');
    }
}
