<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class TopPageTasksController extends Controller
{
    public function tasks(Request $request)
    {
        $user = $request->user();
        $taskName = $request->input('task-name') === null ? '' : $request->input('task-name');
        $startTime = $request->input('start-time') === null ? '' : $request->input('start-time');
        $jobfairName = $request->input('jobfair-name') === null ? '' : $request->input('jobfair-name');
        $tasks = $user->tasks->values();
        $tasks = $tasks->concat($user->reviewTasks->values())->sortBy('start_time')->unique();
        // dd($tasks);
        $tasks->each(function ($task) {
            $task->jobfair = $task->schedule->jobfair;
        });
        $result = array_filter($tasks->all(), function ($task) use ($taskName, $startTime, $jobfairName) {
            return str_contains($task->name, $taskName)
            && str_contains($task->start_time, $startTime)
            && str_contains($task->jobfair, $jobfairName);
        });
        if ($taskName === '' && $startTime === '' && $jobfairName === '') {
            return response()->json(array_values($result));
        }

        return response()->json(array_values($result));
    }

    public function taskReviewer(Request $request)
    {
        $user = $request->user();
        $taskName = $request->input('task-name') === null ? '' : $request->input('task-name');
        $startTime = $request->input('start-time') === null ? '' : $request->input('start-time');
        $jobfairName = $request->input('jobfair-name') === null ? '' : $request->input('jobfair-name');
        $tasks = User::findOrFail($user->id)->reviewTasks->sortBy('start_time')->values();
        // dd($tasks);
        $tasks->each(function ($task) {
            $task->jobfair = $task->schedule->jobfair;
        });
        $result = array_filter($tasks->all(), function ($task) use ($taskName, $startTime, $jobfairName) {
            return str_contains($task->name, $taskName)
            && str_contains($task->start_time, $startTime)
            && str_contains($task->jobfair, $jobfairName);
        });
        if ($taskName === '' && $startTime === '' && $jobfairName === '') {
            return response()->json(array_values($result));
        }

        return response()->json(array_values($result));
    }
}
