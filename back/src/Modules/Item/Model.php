<?php

namespace App\Modules\Item;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Model extends Eloquent
{
    

    protected $table = 'Items';


    protected $fillable = [
        'list',
        'name',
        'price',
        'path',
        'place',
        'place_link',
        'description',
        'img_name'
    ];
}



