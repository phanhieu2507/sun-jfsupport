<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'status',
        'remind_member',
        'description_of_detail',
        'milestone_id',
        'user_id',
        'memo',
        'schedule_id',
        'template_task_id',
        'is_parent',
        'parent_id',
        'company_id',
    ];
    protected $guarded = [];
    protected $casts = [
        'start_time' => 'date: Y/m/d',
        'end_time'   => 'date: Y/m/d',
    ];

    public function milestone()
    {
        return $this->belongsTo(Milestone::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'assignments', 'task_id', 'user_id')->withPivot([
            'completed_date',
            'join_date',
            'notification',
            'status',
        ]);
    }

    public function reviewers()
    {
        return $this->belongsToMany(User::class, 'task_reviewer', 'task_id', 'reviewer_id');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'commentable');
    }

    public function categories()
    {
        return $this->morphToMany(Category::class, 'categoriable');
    }

    public function afterTasks()
    {
        return $this->belongsToMany(self::class, 'pivot_table_tasks', 'before_tasks', 'after_tasks');
    }

    public function beforeTasks()
    {
        return $this->belongsToMany(self::class, 'pivot_table_tasks', 'after_tasks', 'before_tasks');
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function templateTask()
    {
        return $this->belongsTo(TemplateTask::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
