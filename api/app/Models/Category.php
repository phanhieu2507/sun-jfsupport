<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['category_name'];

    public function tasks()
    {
        return $this->morphedByMany(Task::class, 'categoriable');
    }

    public function templateTasks()
    {
        return $this->morphedByMany(TemplateTask::class, 'categoriable');
    }

    public function users()
    {
        return $this->morphedByMany(User::class, 'categoriable');
    }

    public function categoryDetails()
    {
        return $this->hasMany(CategoryDetail::class);
    }
}
