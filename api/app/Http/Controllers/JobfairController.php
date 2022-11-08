<?php

namespace App\Http\Controllers;

use App\Http\Requests\JobfairRequest;
use App\Models\Jobfair;
use App\Models\Milestone;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\User;
use App\Notifications\JobfairCreated;
use App\Notifications\JobfairEdited;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class JobfairController extends Controller
{
    protected $slack;

    public function __construct(\App\Services\SlackService $slack)
    {
        $this->middleware('auth')->except('isAdminJobfair');
        $this->slack = $slack;
    }

    private function createRelation($templateTasks, $mapToTaskId)
    {
        $templateTaskIds = $templateTasks->pluck('id')->toArray();
        $prerequisites = DB::table('pivot_table_template_tasks')->select(['after_tasks', 'before_tasks'])
            ->whereIn('before_tasks', $templateTaskIds)->whereIn('after_tasks', $templateTaskIds)->get();
        $prerequisites = $prerequisites->map(function ($element) use ($mapToTaskId) {
            return [
                'before_tasks' => $mapToTaskId[$element->before_tasks],
                'after_tasks'  => $mapToTaskId[$element->after_tasks],
            ];
        });
        DB::table('pivot_table_tasks')->insert($prerequisites->toArray());
        // template task child -> template task parent: relatively task child -> task parent
        $templateTasks->each(function ($element) use ($mapToTaskId) {
            if (isset($element->pivot->template_task_parent_id)) {
                $task = Task::findOrFail($mapToTaskId[$element->id]);
                $task->parent_id = $mapToTaskId[$element->pivot->template_task_parent_id];
                $task->save();
            }
        });
    }

    private function setNewStartTimeFromMilestone($milestone, $jobfair, &$startTime)
    {
        $numDates = $milestone['is_week'] ?
            $milestone['period'] * 7
            : $milestone['period'];
        $startTime = date(
            'Y-m-d',
            strtotime($jobfair->start_date.' + '.$numDates.'days')
        );
    }

    private function createMilestonesAndTasks($templateSchedule, $newSchedule, $jobfair)
    {
        $templateTasks = $templateSchedule->templateTasks()->with('milestone')->with('beforeTasks')->get();
        $milestones = $templateSchedule->milestones()->with('templateTasks', function ($query) use ($templateTasks) {
            $query->whereIn('template_tasks.id', $templateTasks->pluck('id')->toArray());
        })->get();
        orderMilestonesByPeriod($milestones);
        $mapTemplateTaskToTaskID = collect([]);
        foreach ($milestones->toArray() as $milestone) {
            $templateTaskIds = array_map(function ($item) {
                return $item['id'];
            }, $milestone['template_tasks']);
            if (count($templateTaskIds) > 0) {
                // start time of the milestone
                $currentStartTime = date('Y-m-d', strtotime($jobfair->start_date));
                $this->setNewStartTimeFromMilestone($milestone, $jobfair, $currentStartTime);
                foreach ($templateTaskIds as $templateTaskId) {
                    $templateTask = $templateTasks->where('id', $templateTaskId)->first();
                    // start time is max of the latest end time of before task and its milestone start time
                    // can always calculate end time of before tasks because of before tasks is always be handled first (ordered by TaskRelation func)
                    if ($templateTask->is_parent !== 1) {
                        $newStartTime = date(
                            'Y-m-d',
                            strtotime($currentStartTime.'+ '.strval($templateTask->pivot->start_time).' day')
                        );

                        $duration = $templateTask->pivot->duration - 1;

                        $newEndTime = date('Y-m-d', strtotime($newStartTime.' + '.max($duration, 0).'days'));
                        $input = $templateTask->toArray();
                        $input['is_parent'] = $templateTask->is_parent;
                        $input['start_time'] = $newStartTime;
                        $input['end_time'] = $newEndTime;
                        $input['schedule_id'] = $newSchedule->id;
                        $input['status'] = '未着手';
                        $input['template_task_id'] = $templateTask->id;
                        if ($templateTask->is_parent === 1) {
                            $input['description_of_detail'] = '';
                        }

                        $newTask = Task::create($input);
                        $newTask->categories()->attach($templateTask->categories);
                        $mapTemplateTaskToTaskID->put($templateTaskId, $newTask->id);
                    }
                }

                $templateTasks->whereIn('id', $templateTaskIds)
                    ->where('is_parent', 1)->each(function ($parentTT) use ($currentStartTime, $newSchedule, &$mapTemplateTaskToTaskID) {
                        $newStartTime = date(
                            'Y-m-d',
                            strtotime($currentStartTime.'+ '.strval($parentTT->pivot->start_time).' day')
                        );

                        $duration = $parentTT->pivot->duration - 1;

                        $newEndTime = date('Y-m-d', strtotime($newStartTime.' + '.max($duration, 0).'days'));
                        $input = $parentTT->toArray();
                        $input['is_parent'] = $parentTT->is_parent;
                        $input['start_time'] = $newStartTime === null ? $currentStartTime : $newStartTime;
                        $input['end_time'] = $newEndTime;
                        $input['schedule_id'] = $newSchedule->id;
                        $input['status'] = '未着手';
                        $input['template_task_id'] = $parentTT->id;
                        if ($parentTT->is_parent === 1) {
                            $input['description_of_detail'] = '';
                        }

                        $newTask = Task::create($input);
                        $newTask->categories()->attach($parentTT->categories);
                        $mapTemplateTaskToTaskID->put($parentTT->id, $newTask->id);
                    });
            }
        }

        // clone relation
        $this->createRelation($templateTasks, $mapTemplateTaskToTaskID);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $jobfairs = Jobfair::with(['admins:id,name'])->orderBy('jobfairs.updated_at', 'DESC')->get();

        return response()->json($jobfairs);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(JobfairRequest $request)
    {
        $arr = str_split($request->schedule_id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        if (!$this->isUsersExist($request->admin_ids)) {
            return response(['message' => 'ID of a admin is invalid'], 422);
        }

        $slackIds = User::whereIn('id', $request->admin_ids)->select('chatwork_id')->get();
        $listSlackId = [];//list slack ids of admin
        foreach ($slackIds as $item) {
            $resCheckInfo = json_decode($this->slack->checkInWorkspace($item->chatwork_id));
            if ($resCheckInfo->ok === false) {
                return response()->json([
                    'not_in_workspace_error' => $resCheckInfo->error,
                ], 422);
            }

            array_push($listSlackId, $item->chatwork_id);
        }

        if ($request->channel_type === 0) {
            $channelname = strtolower($request->channel);
            $response = $this->slack->createChannel($channelname);
            $res = json_decode($response);
            if ($res->ok === false) {
                return response()->json($res, 422);
            }
        } else {
            $tmpJF = DB::table('jobfairs')->where(['channel_id' => $request->channel])->get();
            if (!$tmpJF->isEmpty()) {
                return response()->json(['error' => config('slack.messages.errors.channelExists')], 422);
            }

            $response = $this->slack->getInfoChannel($request->channel);
            $res = json_decode($response);
            if ($res->ok === false) {
                return response()->json(['get_chanel_failed' => $res]);
            } else if (!$res->channel->is_member) {
                return response()->json(['is_not_member' => $res], 422);
            }
        }

        $templateSchedule = Schedule::findOrFail($request->schedule_id);
        $jobfair = Jobfair::create($request->validated());
        $jobfair->admins()->attach($request->admin_ids);

        $newSchedule = Schedule::create($templateSchedule->toArray());
        $newSchedule->update(['jobfair_id' => $jobfair->id]);
        $newSchedule->milestones()->attach($templateSchedule->milestones);

        // create milestone and task for new schedule
        $this->createMilestonesAndTasks($templateSchedule, $newSchedule, $jobfair);
        if ($res->ok === true) {
            $jobfair->channel_id = $res->channel->id;
            $jobfair->save();

            $this->slack->addUserToChannel($jobfair->channel_id, $listSlackId);
            $this->slack->createChannelBot($jobfair->name, $res->channel->id, $jobfair->id);
            $this->slack->addSuperAdminToChannel($jobfair->channel_id);
        }

        foreach ($jobfair->admins as $jfAdmin) {
            $jfAdmin->notify(new JobfairCreated($jobfair, auth()->user()));
        }

        return $jobfair;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        // $jobfair = Jobfair::with('user:id,name')->findOrFail($id);
        // if ($jobfair->channel_id !== null) {
        //     $response = $this->slack->getInfoChannel($jobfair->channel_id);
        //     $res = json_decode($response);
        //     if ($res->ok === true) {
        //         $jobfair->setAttribute('channel_name', $res->channel->name);
        //     } else {
        //         $jobfair->channel_id = null;
        //         $jobfair->update();
        //         $jobfair->setAttribute('channel_name', null);
        //     }
        // } else {
        //     $jobfair->setAttribute('channel_name', null);
        // }

        return Jobfair::with(['admins:id,name,email'])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $today = date('Y-m-d');
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $jobfair = Jobfair::with(['admins:id'])->findOrFail($id);

        if ($request->schedule_id !== 'none' && $today < $request->start_date) {
            $schedule = Schedule::where('jobfair_id', '=', $id)->first();
            $templateSchedule = Schedule::find($request->schedule_id);
            $schedule->update(['name' => $templateSchedule->name]);
            $schedule->milestones()->sync($templateSchedule->milestones);
            $schedule->tasks()->delete();
            $this->createMilestonesAndTasks($templateSchedule, $schedule, $jobfair);
        }

        //Slack
        // if ($jobfair->channel_id !== null) {
        //     $response = $this->slack->changeNameChannel($jobfair->channel_id, $request->channel_name);
        //     $res = json_decode($response);
        //     if ($res->ok === false && $res->error === 'name_taken') {
        //         return response()->json(['message' => 'Name channel already in use'], 422);
        //     }
        // } else {
        //     $response = $this->slack->createChannel($request->channel_name);
        //     $res = json_decode($response);
        //     if ($res->ok === false && $res->error === 'name_taken') {
        //         return response()->json(['message' => 'Name channel already in use'], 422);
        //     }

        //     if ($res->ok === true) {
        //         $jobfair->channel_id = $res->channel->id;
        //         $slackid = User::where('id', '=', $jobfair->jobfair_admin_id)->get(['chatwork_id']);
        //         $dataAdminToChannel = [$jobfair->channel_id, $slackid[0]->chatwork_id];
        //         $this->slack->addAdminToChannel($dataAdminToChannel);
        //         $this->slack->createChannelBot($jobfair->name, $res->channel->id, $jobfair->id);
        //     }
        // }

        $validated = $request->validate([
            'name'                => 'string|max:256',
            'start_date'          => 'date',
            'number_of_students'  => 'numeric',
            'number_of_companies' => 'numeric',
            'admin_ids' => 'required|array|min:1',
        ]);
        if (!$this->isUsersExist($request->admin_ids)) {
            return response(['message' => 'ID of a admin is invalid'], 422);
        }

        $oldListJFAdminID = [];
        foreach ($jobfair->admins as $admin) {
            array_push($oldListJFAdminID, $admin->id);
        }

        $newAddedJFAdmins = array_diff($request->admin_ids, $oldListJFAdminID);
        $newAddedJFAdminsSlackID = User::whereIn('id', $newAddedJFAdmins)->select('chatwork_id')->get();
        $listSlackId = [];
        foreach ($newAddedJFAdminsSlackID as $item) {
            $resCheckInfo = json_decode($this->slack->checkInWorkspace($item->chatwork_id));
            if ($resCheckInfo->ok === false) {
                return response()->json([
                    'not_in_workspace_error' => $resCheckInfo->error,
                ], 422);
            }

            array_push($listSlackId, $item->chatwork_id);
        }

        $this->slack->addUserToChannel($jobfair->channel_id, $listSlackId);

        $jobfair->admins()->sync($request->admin_ids);
        $jobfair->update($validated);

        $editedUser = auth()->user();

        // notify user
        if ($editedUser->role === 1) {
            foreach ($jobfair->admins as $jfAdmin) {
                $jfAdmin->notify(new JobfairEdited($jobfair, $editedUser));
            }
        } else {
            Notification::send(
                User::where('role', 1)
                    ->get(),
                new JobfairEdited($jobfair, $editedUser)
            );
        }

        return response()->json('success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
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

        Jobfair::findOrFail($id)->delete();
        $jobfairs = Jobfair::with(['admins:id,name'])->orderBy('jobfairs.updated_at', 'DESC')->get();

        return response()->json($jobfairs);
    }

    public function getMilestones($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $schedule = Jobfair::findOrFail($id)->schedule;
        $milestonesId = collect(Task::where('schedule_id', $schedule->id)->pluck('milestone_id'));

        $milestones = Milestone::whereIn('id', $milestonesId->unique())->get(['id', 'name', 'period', 'is_week']);
        foreach ($milestones as $item) {
            $day = $item->is_week === 1 ? $item->period * 7 : $item->period;
            $item['day'] = $day;
        }

        $milestones = $milestones->sortBy('day');
        $milestones = array_values($milestones->toArray());
        foreach ($milestones as $key => $milestone) {
            $milestones[$key]['task'] = Task::where('milestone_id', $milestone['id'])->where('schedule_id', $schedule->id)->get(['id', 'name', 'status']);
        }

        return response()->json($milestones);
    }

    public function getTasks($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $tasks = Jobfair::with([
            'schedule.tasks' => function ($query) {
                $query->with('milestone:id,name', 'users:id,name', 'categories:id,category_name')
                    ->select([
                        'tasks.id',
                        'tasks.name',
                        'tasks.is_parent',
                        'tasks.parent_id',
                        'tasks.start_time',
                        'tasks.end_time',
                        'tasks.milestone_id',
                        'tasks.status',
                        'tasks.schedule_id',
                    ])
                    ->orderBy('tasks.id', 'ASC');
            },
        ])->findOrFail($id, ['id']);

        return response()->json($tasks);
    }

    public function getTasksWithParent($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $tasks = Jobfair::with([
            'schedule.tasks' => function ($query) {
                $query->with('milestone:id,name', 'users:id,name', 'categories:id,category_name')
                    ->where('is_parent', 1)->orWhere(function ($query) {
                        $query->where('is_parent', 0)->where('parent_id', null);
                    })
                    ->orderBy('tasks.id', 'ASC');
            },
            'companies',
        ])->findOrFail($id, ['id']);
        $jobfair = Jobfair::with([
            'schedule.tasks' => function ($query) {
                $query->with('milestone:id,name', 'users:id,name', 'categories:id,category_name');
            },
        ])->findOrFail($id, ['id']);
        $tasks->schedule->tasks = $tasks->schedule->tasks->map(function ($task) use ($jobfair) {
            if ($task->is_parent === 1) {
                $temp = $jobfair->schedule->tasks->where('parent_id', $task->id);
                $task->children = collect([]);
                $temp->each(function ($item, $key) use ($temp, &$task) {
                    $task->children->push($temp[$key]);
                });
            }

            return $task;
        });

        return response()->json($tasks);
    }

    public function updatedTasks($id, Request $request)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $tasks = Jobfair::with([
            'schedule:id,jobfair_id', 'schedule.tasks' => function ($query) {
                $query->select(['tasks.name', 'tasks.updated_at', 'tasks.id', 'tasks.schedule_id', 'users.name as username'])
                    ->join('users', 'users.id', '=', 'tasks.user_id')
                    ->orderBy('tasks.updated_at', 'DESC')
                    ->take(30);
            },
        ])->findOrFail($id, ['id']);

        return response()->json($tasks);
    }

    public function searchTask($id, Request $request)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $tasks = Jobfair::with([
            'schedule.tasks' => function ($q) use ($request) {
                $q->select('id', 'name', 'status', 'start_time', 'end_time', 'updated_at', 'schedule_id')
                    ->where('tasks.name', 'LIKE', '%'.$request->name.'%');
            },
        ])->findOrFail($id, ['id']);

        return response()->json($tasks);
    }

    public function checkNameExisted(Request $request)
    {
        return Jobfair::where('name', '=', $request->name)->get();
    }

    public function isAdminJobfair(Request $request)
    {
        $arr = str_split($request->input('jobfairId'));
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $jobfair = Jobfair::with(['admins:id'])->findOrFail($request->input('jobfairId'));
        $adminIds = $jobfair->admins;
        foreach ($adminIds as $admin) {
            if ($admin->id === intval($request->input('userId'))) {
                return response('Access granted', 200);
            }
        }

        abort(403, 'Permission denied');
    }

    public function ganttChart($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $jobfair = Jobfair::findOrFail($id);
        $tasks = $jobfair->schedule->tasks()->where('is_parent', 0)->with(['beforeTasks', 'afterTasks'])->get();

        return response()->json($tasks);
    }

    public function isUsersExist($listUsers)
    {
        $allUsers = User::where('id', '!=', 1)->pluck('id')->toArray();

        return !array_diff($listUsers, $allUsers);
    }
}
