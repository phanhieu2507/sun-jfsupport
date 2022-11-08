<?php

namespace App\Observers;

use App\Models\Task;
use Illuminate\Validation\Rules\Exists;

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     *
     * @param  \App\Models\Task  $task
     * @return void
     */
    public function created(Task $task)
    {
        //
    }

    /**
     * Handle the Task "updated" event.
     *
     * @param  \App\Models\Task  $task
     * @return void
     */
    public function updated(Task $task)
    {
        if ($task->wasChanged('status')) {
            if (!$task->parent_id) {
                return;
            }

            $parent = Task::find($task->parent_id);
            $parent_status = $parent->status;

            $children_status = Task::select('status')
                ->where('parent_id', $task->parent_id)
                ->get();

            $children_count = $children_status->count();

            $children_status_freq = collect($children_status)
                ->map(function ($c) {
                    return $c->status;
                })
                ->countBy()
                ->all();

            foreach ($children_status_freq as $status => $count) {
                if ($status === '進行中') {
                    $parent_status = $status;
                    break;
                }

                if (in_array($status, ['完了', '中断', '未完了', '未着手'])) {
                    if ($children_status_freq[$status] === $children_count) {
                        $parent_status = $status;
                        break;
                    }

                    if (!array_key_exists('未着手', $children_status_freq)) {
                        $parent_status = '完了';
                        break;
                    }

                    $parent_status = '進行中';
                    break;
                }
            }

            $parent->status = $parent_status;
            $parent->save();
        }
    }

    /**
     * Handle the Task "deleted" event.
     *
     * @param  \App\Models\Task  $task
     * @return void
     */
    public function deleted(Task $task)
    {
        //
    }

    /**
     * Handle the Task "restored" event.
     *
     * @param  \App\Models\Task  $task
     * @return void
     */
    public function restored(Task $task)
    {
        //
    }

    /**
     * Handle the Task "force deleted" event.
     *
     * @param  \App\Models\Task  $task
     * @return void
     */
    public function forceDeleted(Task $task)
    {
        //
    }
}
