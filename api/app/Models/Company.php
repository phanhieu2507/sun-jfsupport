<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = ['company_name'];

    public function jobfairs()
    {
        return $this->morphedByMany(Jobfair::class, 'companiable');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
