<?php

namespace App\Http\Controllers;

use App\Events\Broadcasting\CommentCreated;
use App\Models\Assignment;
use App\Models\Comment;
use App\Models\Jobfair;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskCreated;
use App\Notifications\TaskEdited;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Comment::all();
    }

    public function store(Request $request)
    {
        // $status = ['未着手', '進行中'];
        // validate request: add 'Accept: application/json' to request headers to get error message
        $assignee = [];
        $status = '';
        if (!$request->has('body') && !$request->has('status') && !$request->has('assignee')) {
            return response('Can not empty', 409);
        }

        $request->validate([
            'task_id'     => 'required|numeric|exists:tasks,id',
            'status'      => 'string',
            'body'        => 'string|nullable',
            'description' => 'string',
        ]);
        // $input is attributes for new comment
        $input = [
            'user_id' => auth()->user()->id,
            'task_id' => $request->task_id,
            'body'    => $request->body,
        ];
        $task = Task::find($request->task_id);

        $isUpdatedTask = false;
        if ($request->has('status')) {
            $status = $request->status;
            if ($task->status !== $request->status) {
                $input['old_status'] = $task->status;
                $input['new_status'] = $request->status;
                $updateContent = [
                    'status' => $request->status,
                ];
                // store task-updating history in comment and update task
                if ($request->has('memo')) {
                    $updateContent = [
                        'status' => $request->status,
                        'memo' => $request->memo,
                    ];
                }

                $task->update($updateContent);
                $isUpdatedTask = true;
                Assignment::where('task_id', $request->task_id)->update(['status' => $request->status]);
            }
        }

        if ($request->has('memberStatus')) {
            $userId = auth()->user()->id;
            $username = auth()->user()->name;
            if ($request->has('member')) {
                $userId = $request->member;
                $memberName = User::find($request->member)->name;
                $username = $memberName;
            }

            $assignment = Assignment::where('user_id', $userId)->where('task_id', $request->task_id)->get();
            if ($assignment[0]->status !== $request->memberStatus) {
                $input['old_member_status'] = $assignment[0]->status;
                $input['new_member_status'] = $request->memberStatus;
                $input['member_name'] = $username;
                Assignment::where('user_id', $userId)->where('task_id', $request->task_id)->update(['status' => $request->memberStatus]);
                $isUpdatedTask = true;
                $assignmentTemps = Assignment::where('task_id', $request->task_id)->get();
                $isNew = true;
                foreach ($assignmentTemps as $assignmentTemp) {
                    if (strcmp($assignmentTemp->status, '未着手') !== 0) {
                        $isNew = false;
                    }
                }

                if ($isNew === false) {
                    $task = Task::find($request->task_id);
                    if ($task->status === '未着手') {
                        $task->status = '進行中';
                        $task->save();
                        $input['new_status'] = $task->status;
                    }
                } else {
                    $task = Task::find($request->task_id);
                    if ($task->status !== '未着手') {
                        $task->status = '未着手';
                        $task->save();
                        $input['new_status'] = $task->status;
                    }
                }
            }
        }

        if ($request->has('description')) {
            if ($request->description !== $task->description_of_detail) {
                $input['old_description'] = $task->description_of_detail;
                $input['new_description'] = $request->description;
            }

            $task->update(['description_of_detail' => $request->description]);
            $isUpdatedTask = true;
        }

        //notification
        if ($isUpdatedTask) {
            $editedUser = auth()->user();
            $jobfairAdmins = $task->schedule->jobfair->admins;
            Notification::send(
                $task->users()
                    ->where('users.id', '<>', $editedUser->id)->get(),
                new TaskEdited($editedUser, $task)
            );
            Notification::send(
                $task->reviewers()
                    ->where('users.id', '<>', $editedUser->id)->get(),
                new TaskEdited($editedUser, $task)
            );
            foreach ($jobfairAdmins as $jobfairAdmin) {
                if ($editedUser->id !== $jobfairAdmin->id) {
                    $jobfairAdmin->notify(new TaskEdited($editedUser, $task));
                }
            }
        }

        if ($request->has('assignee')) {
            $listMember = json_decode($request->assignee, true);
            $listOldMember = $task->users->pluck('id')->toArray();
            $assignee = collect($listMember)->map(function ($id) {
                return [
                    'id'   => $id,
                    'name' => User::find($id)->name,
                ];
            });
            // if old assignees equal to request's assignees (in any order) then don't update anything
            if (
                !(is_array($listMember)
                    && is_array($listOldMember)
                    && count($listMember) === count($listOldMember)
                    && array_diff($listMember, $listOldMember) === array_diff($listOldMember, $listMember))
            ) {
                // store list assignees as string with format "id1, id2, id3, ..."
                $input['old_assignees'] = implode(',', $listOldMember);
                $input['new_assignees'] = implode(',', $listMember);
                // sync laravel N to N
                $task->users()->syncWithPivotValues($listMember, [
                    'join_date' => Carbon::now()->toDateTimeString(),
                    'status' => '未着手',
                ]);

                // notification for new assignees
                $newAssignees = array_diff($listMember, $listOldMember);
                $listId = [];
                foreach ($newAssignees as $newAssignee) {
                    $listId[] = $newAssignee;
                }

                Notification::send(
                    User::whereIn('id', $listId)->get(),
                    new TaskCreated($task, auth()->user())
                );
                if (!$isUpdatedTask) {
                    $editedUser = auth()->user();
                    $jobfairAdmins = $task->schedule->jobfair->admins;
                    Notification::send(
                        $task->users()
                            ->where('users.id', '<>', $editedUser->id)->get(),
                        new TaskEdited($editedUser, $task)
                    );
                    Notification::send(
                        $task->reviewers()
                            ->where('users.id', '<>', $editedUser->id)->get(),
                        new TaskEdited($editedUser, $task)
                    );
                    foreach ($jobfairAdmins as $jobfairAdmin) {
                        if ($editedUser->id !== $jobfairAdmin->id) {
                            $jobfairAdmin->notify(new TaskEdited($editedUser, $task));
                        }
                    }

                    $isUpdatedTask = true;
                }
            }
        }

        if ($request->has('reviewers')) {
            $checkKey = 1;

            // check is each reviewers valid
            $jfAdminIds = $task->schedule->jobfair->admins->pluck('id')->toArray();

            foreach ($request->input('reviewers') as $key => $reviewerId) {
                $user = User::find($reviewerId);
                $categories = array_column($user->categories->toArray(), 'category_name');
                if (
                    (in_array('レビュアー', $categories)
                    && in_array($task->categories()->first()->category_name, $categories))
                    || in_array($reviewerId, $jfAdminIds)
                ) {
                    continue;
                }

                $checkKey = 0;

                break;
            }

            if ($checkKey !== 1) {
                return response()->json(['message' => 'list reviewers invalid'], 400);
            }

            $oldReviewers = $task->reviewers;
            $newReviewers = User::whereIn('id', $request->input('reviewers'))->get();
            $newReviewersID = $newReviewers->pluck('id')->toArray();

            if (
                count(array_merge(
                    array_diff($oldReviewers->pluck('id')->toArray(), $newReviewersID),
                    array_diff($newReviewersID, $oldReviewers->pluck('id')->toArray()),
                ))
            ) {
                $input['old_reviewers'] = implode(',', $oldReviewers->pluck('name')->toArray());
                $input['new_reviewers'] = implode(',', $newReviewers->pluck('name')->toArray());

                // Update reviewers
                $task->reviewers()->sync($newReviewersID);

                $isUpdatedTask = true;
            }
        }

        // mark if a comment is changing task info or not
        if (!$isUpdatedTask) {
            $input['is_normal_comment'] = true;
        }

        // return new comment
        $comment = Comment::create($input);
        CommentCreated::dispatch($comment);

        $listOldAssignees = [];
        $listNewAssignees = [];
        if ($comment->old_assignees && $comment->new_assignees) {
            $listOldAssignees = explode(',', $comment->old_assignees);
            $listNewAssignees = explode(',', $comment->new_assignees);
        }

        $listOldReviewers = [];
        $listNewReviewers = [];
        if (!empty($comment->old_reviewers)) {
            $listOldReviewers = explode(',', $comment->old_reviewers);
        }

        if (!empty($comment->new_reviewers)) {
            $listNewReviewers = explode(',', $comment->new_reviewers);
        }

        $listOldAssignees = collect($listOldAssignees)->map(function ($assingee) {
            return User::find($assingee)->name;
        });
        $listNewAssignees = collect($listNewAssignees)->map(function ($assingee) {
            return User::find($assingee)->name;
        });

        // return [$comment, $listOldAssignees, $listNewAssignees];
        return [
            'id'            => $comment->id,
            'author'        => [
                'id'     => $comment->user->id,
                'name'   => $comment->user->name,
                'avatar' => $comment->user->avatar,
            ],
            'created'       => $comment->created_at,
            'content'       => $comment->body,
            'edited'        => $comment->updated_at > $comment->created_at,
            'last_edit'     => $comment->updated_at,
            'assignee'      => $assignee,
            'status'        => $status,
            'old_status'    => $comment->old_status ?? null,
            'new_status'    => $comment->new_status ?? null,
            'new_assignees' => $listNewAssignees,
            'old_assignees' => $listOldAssignees,
            'new_reviewers' => $listNewReviewers,
            'old_reviewers' => $listOldReviewers,
            'new_member_status' => $comment->new_member_status ?? null,
            'old_member_status' => $comment->old_member_status ?? null,
            'member_name' => $comment->member_name ?? null,
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */

    // in request MUST have 2 query strings: start, count
    public function showMore($id, Request $request)
    {
        $request->validate(
            [
                'start' => 'required|numeric',
                'count' => 'required|numeric',
            ]
        );
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $data = Task::with([
            'comments' => function ($query) use ($request) {
                $query->where('is_created_task', false)->latest('updated_at')->offset($request->start)->take($request->count)->get();
            },
            'comments.user:id,name,avatar',
        ])->findOrFail($id, ['id', 'name']);

        $count = Task::findOrFail($id, 'id')->comments
            ->filter(function ($value, $key) {
                return !$value->is_created_task;
            })
            ->count();

        $result = $data->comments->map(function ($comment) {
            $listOldAssignees = [];
            $listNewAssignees = [];
            if ($comment->old_assignees && $comment->new_assignees) {
                $listOldAssignees = explode(',', $comment->old_assignees);
                $listNewAssignees = explode(',', $comment->new_assignees);
            }

            $listOldAssignees = User::whereIn('id', $listOldAssignees)->pluck('name');
            $listNewAssignees = User::whereIn('id', $listNewAssignees)->pluck('name');

            $listOldReviewers = [];
            $listNewReviewers = [];
            if (!empty($comment->old_reviewers)) {
                $listOldReviewers = explode(',', $comment->old_reviewers);
            }

            if (!empty($comment->new_reviewers)) {
                $listNewReviewers = explode(',', $comment->new_reviewers);
            }

            $listOldPreviousTasks = [];
            $listNewPreviousTasks = [];
            if ($comment->old_previous_tasks && $comment->new_previous_tasks) {
                $listOldPreviousTasks = explode(',', $comment->old_previous_tasks);
                $listNewPreviousTasks = explode(',', $comment->new_previous_tasks);
            }

            $listOldFollowingTasks = [];
            $listNewFollowingTasks = [];
            if ($comment->old_following_tasks && $comment->new_following_tasks) {
                $listOldFollowingTasks = explode(',', $comment->old_following_tasks);
                $listNewFollowingTasks = explode(',', $comment->new_following_tasks);
            }

            // return $comment;
            return [
                'id'                  => $comment->id,
                'author'              => [
                    'id'     => $comment->user->id,
                    'name'   => $comment->user->name,
                    'avatar' => $comment->user->avatar,
                ],
                'created'             => $comment->created_at,
                'content'             => $comment->body,
                'edited'              => $comment->updated_at > $comment->created_at,
                'last_edit'           => $comment->updated_at,
                'old_assignees'       => $listOldAssignees ?? null,
                'new_assignees'       => $listNewAssignees ?? null,
                'old_description'     => $comment->old_description,
                'new_description'     => $comment->new_description,
                'old_status'          => $comment->old_status,
                'new_status'          => $comment->new_status,
                'old_previous_tasks'  => $listOldPreviousTasks ?? null,
                'new_previous_tasks'  => $listNewPreviousTasks ?? null,
                'old_following_tasks' => $listOldFollowingTasks ?? null,
                'new_following_tasks' => $listNewFollowingTasks ?? null,
                'old_name'            => $comment->old_name,
                'new_name'            => $comment->new_name,
                'old_reviewers'       => $listOldReviewers ?? null,
                'new_reviewers'       => $listNewReviewers ?? null,
                'old_start_date'      => $comment->old_start_date,
                'new_start_date'      => $comment->new_start_date,
                'old_end_date'        => $comment->old_end_date,
                'new_end_date'        => $comment->new_end_date,
                'is_created_task'     => $comment->is_created_task,
                'new_member_status' => $comment->new_member_status ?? null,
                'old_member_status' => $comment->old_member_status ?? null,
                'member_name' => $comment->member_name ?? null,
            ];
        });

        return response()->json([
            'comments' => $result,
            'total_comments' => $count,
        ]);
    }

    public function showMoreInJobfair($JFid, Request $request)
    {
        $request->validate(
            [
                'start' => 'required|numeric',
                'count' => 'required|numeric',
            ]
        );
        // $data = Task::with([
        //     'comments' => function ($query) use ($request) {
        //         $query->latest('updated_at')->offset($request->start)->take($request->count)->get();
        //     },
        //     'comments.user:id,name,avatar',
        // ])->find($id, ['id', 'name']);
        $comments = collect([]);
        if ($JFid !== 'all') {
            $arr = str_split($JFid);
            foreach ($arr as $char) {
                if ($char < '0' || $char > '9') {
                    return response(['message' => 'invalid id'], 404);
                }
            }

            Jobfair::findOrFail($JFid);
            $comments = Comment::with('task.schedule.jobfair:id')->whereHas('task', function ($query) use ($JFid) {
                $query->whereHas('schedule', function ($query) use ($JFid) {
                    $query->where('jobfair_id', $JFid);
                });
            })->latest('updated_at')->offset($request->start)->take($request->count)->get();
        } else {
            $comments = Comment::with('task.schedule.jobfair:id')->where('is_normal_comment', false)
                ->latest('updated_at')->offset($request->start)->take($request->count)->get();
        }

        $result = $comments->map(function ($comment) {
            $listOldAssignees = [];
            $listNewAssignees = [];
            if ($comment->old_assignees || $comment->new_assignees) {
                $listOldAssignees = explode(',', $comment->old_assignees);
                $listNewAssignees = explode(',', $comment->new_assignees);
            }

            $listOldAssignees = User::whereIn('id', $listOldAssignees)->pluck('name');
            $listNewAssignees = User::whereIn('id', $listNewAssignees)->pluck('name');
            $listOldPreviousTasks = [];
            $listNewPreviousTasks = [];
            $listOldFollowingTasks = [];
            $listNewFollowingTasks = [];
            $listOldReviewers = [];
            $listNewReviewers = [];
            if ($comment->old_previous_tasks || $comment->new_previous_tasks) {
                $listOldPreviousTasks = explode(',', $comment->old_previous_tasks);
                $listNewPreviousTasks = explode(',', $comment->new_previous_tasks);
            }

            if ($comment->old_following_tasks || $comment->new_following_tasks) {
                $listOldFollowingTasks = explode(',', $comment->old_following_tasks);
                $listNewFollowingTasks = explode(',', $comment->new_following_tasks);
            }

            if ($comment->old_reviewers || $comment->new_reviewers) {
                $listOldReviewers = explode(',', $comment->old_reviewers);
                $listNewReviewers = explode(',', $comment->new_reviewers);
            }

            // return $comment;
            return [
                'id'                  => $comment->id,
                'task'                => [
                    'name' => $comment->task->name,
                    'id'   => $comment->task->id,
                ],
                'author'              => [
                    'id'     => $comment->user->id,
                    'name'   => $comment->user->name,
                    'avatar' => $comment->user->avatar,
                ],
                'jobfair' => [
                    'id' => $comment->task->schedule->jobfair->id,
                ],
                'created'             => $comment->created_at,
                'content'             => $comment->body,
                'edited'              => $comment->updated_at > $comment->created_at,
                'last_edit'           => $comment->updated_at,
                'old_assignees'       => $listOldAssignees ?? null,
                'new_assignees'       => $listNewAssignees ?? null,
                'old_description'     => $comment->old_description,
                'new_description'     => $comment->new_description,
                'old_status'          => $comment->old_status,
                'new_status'          => $comment->new_status,
                'old_previous_tasks'  => $listOldPreviousTasks ?? null,
                'new_previous_tasks'  => $listNewPreviousTasks ?? null,
                'old_following_tasks' => $listOldFollowingTasks ?? null,
                'new_following_tasks' => $listNewFollowingTasks ?? null,
                'old_name'            => $comment->old_name,
                'new_name'            => $comment->new_name,
                'old_reviewers'       => $listOldReviewers ?? null,
                'new_reviewers'       => $listNewReviewers ?? null,
                'old_start_date'      => $comment->old_start_date,
                'new_start_date'      => $comment->new_start_date,
                'old_end_date'        => $comment->old_end_date,
                'new_end_date'        => $comment->new_end_date,
                'is_created_task'     => $comment->is_created_task,
                'is_normal_comment'   => $comment->is_normal_comment,
                'new_member_status' => $comment->new_member_status ?? null,
                'old_member_status' => $comment->old_member_status ?? null,
                'member_name' => $comment->member_name ?? null,
            ];
        });

        return response()->json($result);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'content' => 'string',
        ]);
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        if (
            !Comment::findOrFail($id)->update([
                'body' => $request->content,
            ])
        ) {
            return response()->json(['message' => 'Fail to update'], 500);
        }

        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $comment = Comment::findOrFail($id);

        return response()->json($comment, 200);

        // $data = [
        //     'id'        => $comment->id,
        //     'author'    => [
        //         'id'     => $comment->user->id,
        //         'name'   => $comment->user->name,
        //         'avatar' => $comment->user->avatar,
        //     ],
        //     'created'   => $comment->created_at,
        //     'content'   => $comment->body,
        //     'edited'    => $comment->updated_at > $comment->created_at,
        //     'last_edit' => $comment->updated_at,
        //     'assignee'  => [],
        //     'status'    => 'status',
        // ];

        // return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Comment::findOrFail($id)->delete();
    }
}
