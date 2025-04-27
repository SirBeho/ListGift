<?php

namespace App\Modules\List;

use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// use Illuminate\Database\Eloquent\Relations\BelongsToMany;
// use Illuminate\Database\Eloquent\Relations\HasMany;
// use Illuminate\Database\Eloquent\Relations\HasOne;

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