<?php
// user migragtion file
namespace App\Modules\Lista;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

class Migration
{
    public static function createTable()
    {
        Capsule::schema()->create('lists', function (Blueprint $table) {
            $table->id();
            $table->string('Name');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    public static function dropTable()
    {
        Capsule::schema()->dropIfExists('lists');
    }
}
