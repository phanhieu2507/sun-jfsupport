<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $hidden = ['pivot'];

    protected $fillable = ['name', 'jobfair_id'];

    protected $guarded = [];

    public function milestones()
    {
        return $this->belongsToMany(Milestone::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'list_members');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function jobfair()
    {
        return $this->belongsTo(Jobfair::class);
    }

    public function templateTasks()
    {
        return $this->belongsToMany(TemplateTask::class)->withPivot([
            'template_task_parent_id',
            'duration',
            'start_time',
        ]);
    }
}
