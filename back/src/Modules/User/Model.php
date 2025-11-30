<?php
// model class for users utilizing the Eloquent ORM

namespace App\Modules\User;

use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Role\Model as Role;
use App\Modules\List\Model as Lists;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Model extends Eloquent
{
    protected $table = 'users';

    protected $fillable = [
        'name',
        'username',
        'password',
        'role_id',
        'status',
    ];
    protected $hidden = [
        'password',
        'created_at',
        'updated_at',
    ];

    public function Role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function Lists(): HasMany
    {
        return $this->hasMany(Lists::class, 'user_id');
    }

  
}
