<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jobfair extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'start_date',
        'number_of_students',
        'number_of_companies',
    ];

    public function schedule()
    {
        return $this->hasOne(Schedule::class);
    }

    public function admins()
    {
        return $this->morphToMany(User::class, 'adminable');
    }

    public function companies()
    {
        return $this->morphToMany(Company::class, 'companiable');
    }
}
