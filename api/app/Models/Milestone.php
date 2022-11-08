<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Milestone extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $hidden = ['pivot'];

    protected $fillable = ['name', 'period', 'schedule_id', 'is_week'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function templateTasks()
    {
        return $this->hasMany(TemplateTask::class);
    }

    public function schedules()
    {
        return $this->belongsToMany(Schedule::class);
    }
}
