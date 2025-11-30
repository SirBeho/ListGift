<?php

namespace App\Modules\Item;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Model extends Eloquent
{
    

    protected $table = 'items';


    protected $fillable = [
        'list_id',
        'name',
        'price',
        'path',
        'place',
        'place_link',
        'description',
        'img_name'
    ];

    protected $hidden = ['created_at', 'updated_at'];

    public function list()
    {
        return $this->belongsTo('App\Modules\List\Model', 'list_id');
    }
}



