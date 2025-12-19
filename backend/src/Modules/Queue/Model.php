<?php

namespace App\Modules\Queue;

use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// use Illuminate\Database\Eloquent\Relations\BelongsToMany;
// use Illuminate\Database\Eloquent\Relations\HasMany;
// use Illuminate\Database\Eloquent\Relations\HasOne;

class Model extends Eloquent
{
    protected $table = 'queues';

    protected $fillable = [
        'name',
        // Agrega aquí los campos que se pueden asignar masivamente de tu modelo Queue
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        // Agrega aquí los campos que deben ocultarse
    ];

}