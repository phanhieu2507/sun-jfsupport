<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateTask extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description_of_detail', 'milestone_id', 'is_day', 'unit', 'effort', 'is_parent', 'has_parent', 'is_duplicated'];
    public $timestamps = true;
    protected $guarded = [];

    public function milestone()
    {
        return $this->belongsTo(Milestone::class, 'milestone_id');
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
        return $this->belongsToMany(self::class, 'pivot_table_template_tasks', 'before_tasks', 'after_tasks');
    }

    public function beforeTasks()
    {
        return $this->belongsToMany(self::class, 'pivot_table_template_tasks', 'after_tasks', 'before_tasks');
    }

    public function schedules()
    {
        return $this->belongsToMany(Schedule::class)->withPivot(
            'duration',
            'template_task_parent_id',
            'start_time'
        );
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
