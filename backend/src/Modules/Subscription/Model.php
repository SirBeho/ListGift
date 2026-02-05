<?php

namespace App\Modules\Subscription;

use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\User\Model as UserModel;
// use Illuminate\Database\Eloquent\Relations\BelongsToMany;
// use Illuminate\Database\Eloquent\Relations\HasMany;
// use Illuminate\Database\Eloquent\Relations\HasOne;

class Model extends Eloquent
{
    protected $table = 'subscriptions';

    protected $fillable = ['user_id', 'endpoint', 'p256dh', 'auth'];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

   
    public $timestamps = true;

    // Relación inversa: Una suscripción pertenece a un usuario
    public function user() {
        return $this->belongsTo(UserModel::class, 'user_id');
    }

}