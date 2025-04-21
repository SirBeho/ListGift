<?php
// model class for users utilizing the Eloquent ORM

namespace App\Modules\User;

use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\School\Model as School;
use App\Modules\Role\Model as Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Model extends Eloquent
{
    protected $table = 'users';

    protected $fillable = [
        'name',
        'role_id',
        'username',
        'password',
        'status',
    ];
    protected $hidden = [
        'password',
        'created_at',
        'updated_at',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role);
    }


  
}
