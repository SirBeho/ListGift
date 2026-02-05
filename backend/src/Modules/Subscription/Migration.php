<?php

namespace App\Modules\Subscription;

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

class Migration
{
    public static function createTable()
    {
        Capsule::schema()->create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();;
            $table->text('endpoint'); 
            $table->string('p256dh'); 
            $table->string('auth'); 
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    public static function dropTable()
    {
        Capsule::schema()->dropIfExists('subscriptions');
    }
}