<?php

namespace App\Modules\Lista;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Model extends Eloquent
{

        
    protected $table = 'lists';
    protected $fillable = ['name', 'user_id'];
    protected $hidden = ['created_at', 'updated_at'];

    public function user()
    {
        return $this->belongsTo('App\Modules\User\Model', 'user_id');
    }

   
}
