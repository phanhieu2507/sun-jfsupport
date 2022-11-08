<?php

namespace App\Http\Controllers;

use App\Events\Broadcasting\CommentCreated;
use App\Models\Assignment;
use App\Models\Comment;
use App\Models\Jobfair;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    /*
        new => 未着手
        inProgress => 進行中
        reviewing => レビュー待ち
        completed => 完了
        incompeleted => 未完了
        pending =>  中断
    */
    public function getTaskRole($jobfairId, $userId, $taskId)
    {
        $jobfair = Jobfair::find($jobfairId);
        // if (strcmp($jobfair->jobfair_admin_id, $userId) === 0) {
        if ($jobfair->admins()->where('user_id', $userId)->exists()) {
            return 'jfadmin';
        }

        if (Assignment::where('task_id', $taskId)->count() === 1) {
            $user = User::find($userId);
            if ($user->tasks->find($taskId)->count() === 0) {
                return 'member';
            }

            return 'taskMember';
        }

        $user = User::find($userId);
        if ($user->reviewTasks->find($taskId)) {
            return 'reviewer';
        } else if ($user->tasks->find($taskId)) {
            return 'taskMember'.$userId;
        }

        return 'member';
    }

    // Ham nay khong su dung o bat cu dau
    public function getStatus($jobfairId, $userId, $taskId)
    {
        // if (Jobfair::find($jobfairId)->where('jobfair_admin_id', $userId)->count()) {
        //     return [
        //         '未着手',
        //         '進行中',
        //         '完了',
        //         '未完了',
        //         '中断',
        //     ];
        // }

        if (Assignment::where('task_id', $taskId)->count() === 1) {
            $user = User::find($userId);
            if ($user->tasks->find($taskId)->count() === 0) {
                return null;
            }

            return [
                '未着手',
                '進行中',
                '完了',
                '未完了',
                '中断',
            ];
        }

        $user = User::find($userId);
        if ($user->tasks->find($taskId)) {
            return [
                '未着手',
                '進行中',
                'レビュー待ち',
            ];
        } else if ($user->reviewTasks->find($taskId)) {
            return [
                '未着手',
                '進行中',
                '完了',
                '未完了',
                '中断',
            ];
        }

        return null;
    }

    public function handleStatusTask($taskId)
    {
        $assignments = Assignment::where('task_id', $taskId)->get();
        $isNew = true;
        foreach ($assignments as $assignment) {
            if (strcmp($assignment->status, '未着手') !== 0) {
                $isNew = false;
            }
        }

        if ($isNew === false) {
            $task = Task::find($taskId);
            if (strcmp($task->status, '進行中') === 0) {
                return '進行中';
            }

            $task->status = '進行中';
            $task->save();

            return $task->status;
        }

        return '未着手';
    }

    public function updateStatus($userId, $taskId, Request $request)
    {
        $input = [
            'user_id' => auth()->user()->id,
            'task_id' => $taskId,
            'body'    => '',
        ];
        $assignment = Assignment::where('user_id', $userId)->where('task_id', $taskId)->get();
        //Assignment::where('user_id', $user_id)->where('task_id', $task_id)->update(['status'=>$request->status]);
        //$assignment =  Assignment::where('user_id', $user_id)->where('task_id', $task_id);
        if ($assignment[0]->status !== $request->status) {
            $input['old_status'] = $assignment[0]->status;
            $input['new_status'] = $request->status;
            Assignment::where('user_id', $userId)->where('task_id', $taskId)->update(['status' => $request->status]);
            $comment = Comment::create($input);
            CommentCreated::dispatch($comment);
        }

        $taskStatus = $this->handleStatusTask($taskId);

        return [
            'memberStatus' => $request->status,
            'taskStatus' => $taskStatus,
        ];
    }
}
