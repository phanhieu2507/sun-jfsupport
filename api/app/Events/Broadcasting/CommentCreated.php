<?php

namespace App\Events\Broadcasting;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $comment;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('comment-channel');
    }

    public function broadcastWith()
    {
        $listOldAssignees = [];
        $listNewAssignees = [];
        if ($this->comment->old_assignees || $this->comment->new_assignees) {
            $listOldAssignees = explode(',', $this->comment->old_assignees);
            $listNewAssignees = explode(',', $this->comment->new_assignees);
        }

        $listOldAssignees = User::whereIn('id', $listOldAssignees)->pluck('name');
        $listNewAssignees = User::whereIn('id', $listNewAssignees)->pluck('name');
        $listOldPreviousTasks = [];
        $listNewPreviousTasks = [];
        $listOldFollowingTasks = [];
        $listNewFollowingTasks = [];
        $listOldReviewers = [];
        $listNewReviewers = [];
        if ($this->comment->old_previous_tasks || $this->comment->new_previous_tasks) {
            $listOldPreviousTasks = explode(',', $this->comment->old_previous_tasks);
            $listNewPreviousTasks = explode(',', $this->comment->new_previous_tasks);
        }

        if ($this->comment->old_following_tasks || $this->comment->new_following_tasks) {
            $listOldFollowingTasks = explode(',', $this->comment->old_following_tasks);
            $listNewFollowingTasks = explode(',', $this->comment->new_following_tasks);
        }

        if ($this->comment->old_reviewers || $this->comment->new_reviewers) {
            $listOldReviewers = explode(',', $this->comment->old_reviewers);
            $listNewReviewers = explode(',', $this->comment->new_reviewers);
        }

        // return $this->comment;
        return [
            'id'                  => $this->comment->id,
            'task'                => [
                'name' => $this->comment->task->name,
                'id'   => $this->comment->task->id,
            ],
            'author'              => [
                'id'     => $this->comment->user->id,
                'name'   => $this->comment->user->name,
                'avatar' => $this->comment->user->avatar,
            ],
            'created'             => $this->comment->created_at,
            'content'             => $this->comment->body,
            'edited'              => $this->comment->updated_at > $this->comment->created_at,
            'last_edit'           => $this->comment->updated_at,
            'old_assignees'       => $listOldAssignees ?? null,
            'new_assignees'       => $listNewAssignees ?? null,
            'old_description'     => $this->comment->old_description,
            'new_description'     => $this->comment->new_description,
            'old_status'          => $this->comment->old_status,
            'new_status'          => $this->comment->new_status,
            'old_previous_tasks'  => $listOldPreviousTasks ?? null,
            'new_previous_tasks'  => $listNewPreviousTasks ?? null,
            'old_following_tasks' => $listOldFollowingTasks ?? null,
            'new_following_tasks' => $listNewFollowingTasks ?? null,
            'old_name'            => $this->comment->old_name,
            'new_name'            => $this->comment->new_name,
            'old_reviewers'       => $listOldReviewers ?? null,
            'new_reviewers'       => $listNewReviewers ?? null,
            'old_start_date'      => $this->comment->old_start_date,
            'new_start_date'      => $this->comment->new_start_date,
            'old_end_date'        => $this->comment->old_end_date,
            'new_end_date'        => $this->comment->new_end_date,
            'is_created_task'     => $this->comment->is_created_task,
            'jobfair_id'          => $this->comment->task->schedule->jobfair->id,
            'is_normal_comment'   => $this->comment->is_normal_comment,
        ];
    }
}
