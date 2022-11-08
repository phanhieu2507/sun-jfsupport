<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }

    protected $casts = [
        'id' => 'string',
    ];

    public function notifiable()
    {
        return $this->morphTo();
    }

    public function subjectable()
    {
        return $this->morphTo();
    }
}
