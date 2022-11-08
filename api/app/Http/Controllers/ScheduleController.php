<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScheduleRequest;
use App\Models\Category;
use App\Models\Milestone;
use App\Models\Schedule;
use App\Models\TemplateTask;
use Exception;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScheduleController extends Controller
{
    /**
     * Display list schedule.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Schedule::whereNull('jobfair_id')->get();
    }

    public function getAll()
    {
        return Schedule::whereNull('jobfair_id')->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request)
    {
        try {
            $resSchedule = $request->schedule;
            $resMergeTask = $request->merge_tasks;

            DB::beginTransaction();

            $schedule = new Schedule();
            $schedule->name = $resSchedule['name'];
            $schedule->save();
            $idSchedule = $schedule->id;
            $schedule->milestones()->attach($resSchedule['addedMilestones']);
            $schedule->templateTasks()->attach($resSchedule['addedTemplateTasks']);

            $resMergeTask = (object) [
                'schedule_id' => $idSchedule,
                'parent' => $resMergeTask['parent'],
                'milestones' => $resMergeTask['milestones'],
            ];
            $checkMergeTask = $this->createTemplateTaskParent($resMergeTask);
            if ($checkMergeTask['msg'] === 'ok') {
                DB::commit();

                return response($schedule);
            }

            DB::rollBack();

            return response()->json($checkMergeTask, 422);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => $e->getMessage()], 422);
        }
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

        return Schedule::findOrFail($id);
    }

    public function getAllMilestones()
    {
        return Milestone::all();
    }

    public function getAllTemplateTasks()
    {
        return TemplateTask::with('categories')->where('is_parent', 0)->get();
    }

    public function getAddedMilestones($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Schedule::findOrFail($id)->milestones;
    }

    public function getAddedTemplateTasks($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Schedule::findOrFail($id)->templateTasks()->where('is_parent', 0)->get();
    }

    public function checkScheduleNameExist(Request $request)
    {
        return count(Schedule::where('name', $request->name)->whereNull('jobfair_id')->get()) !== 0 ? 'exist' : 'not exist';
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ScheduleRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $validate = Schedule::whereNull('jobfair_id')->where('id', $id)->get();
            if ($validate->isEmpty()) {
                return response(['message' => 'invalid id'], 404);
            }

            $resSchedule = $request->schedule;
            $resMergeTask = $request->merge_tasks;
            $resMergeTask = (object) [
                'schedule_id' => $id,
                'parent' => $resMergeTask['parent'],
                'milestones' => $resMergeTask['milestones'],
            ];

            $schedule = Schedule::findOrFail($id);
            $oldNameSchedule = $schedule->name;
            $schedule->name = $resSchedule['name'];
            $schedule->save();
            DB::table('schedules')->where('name', '=', $oldNameSchedule)->update(['name' => $resSchedule['name']]);
            $addedMilestones = $resSchedule['addedMilestones'];
            $addedTemplateTasks = $resSchedule['addedTemplateTasks'];
            $schedule->templateTasks()->detach();
            $schedule->templateTasks()->attach($addedTemplateTasks);
            $schedule->templateTasks->each(function ($templateTask) use ($schedule, $addedMilestones) {
                if (!in_array($templateTask->milestone_id, $addedMilestones)) {
                    $schedule->templateTasks()->detach($templateTask->id);
                }
            });
            $schedule->milestones()->detach();
            $schedule->milestones()->attach($addedMilestones);
            $checkMergeTask = $this->createTemplateTaskParent($resMergeTask);
            if ($checkMergeTask['msg'] === 'ok') {
                DB::commit();

                return response($schedule);
            }

            DB::rollBack();

            return response()->json($checkMergeTask, 422);
        } catch (\Exception $error) {
            DB::rollBack();

            return response()->json(['message' => $error->getMessage()], 422);
        }
    }

    public function getMilestones($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Schedule::with('milestones:id,name')->findOrFail($id, ['id']);
    }

    public function getTemplateTasks($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Schedule::with('templateTasks:id,name')->findOrFail($id, ['id']);
    }

    public function search(Request $request)
    {
        return Schedule::where('name', 'like', '%'.$request->input('name').'%')->get();
    }

    public function getSchedule($id)
    {
        $schedule = Schedule::where('jobfair_id', '=', $id)->get();

        return response()->json([
            'data' => $schedule,
        ]);
    }

    // /**
    //  * Get categories have tasks in schedule
    //  *
    //  * @param  int  $scheduleId
    //  * @return Array categories
    //  */
    private function getCategories($scheduleId)
    {
        $templateTasks = Schedule::find($scheduleId)->templateTasks
            ->pluck('id');

        return Category::whereHas(
            'templateTasks',
            function (EloquentBuilder $query) use ($templateTasks) {
                $query->whereIn('template_tasks.id', $templateTasks);
            }
        )->with([
            'templateTasks' => function ($query) use ($scheduleId) {
                $query->whereHas('schedules', function (EloquentBuilder $query) use ($scheduleId) {
                    $query->where('schedules.id', $scheduleId);
                });
            },
        ])->get()->map(function ($item) {
            return [
                'id'            => $item->id,
                'name'          => $item->category_name,
                'numberOfTasks' => count($item->templateTasks),
            ];
        });
    }

    private function getChildren($schedule, $parentId)
    {
        return $schedule->templateTasks->filter(function ($value, $key) use ($parentId) {
            return $value->pivot->template_task_parent_id === $parentId;
        })->pluck('id')->toArray();
    }

    /**
     * Get list milestones attach template tasks with relation
     * @return Array
     */
    public function getList($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $schedule = Schedule::findOrFail($id);
        $milestones = $schedule->milestones;
        $milestonesLength = count($milestones);
        // get all template tasks in schedule
        $scheduleTemplateTasks = $schedule->templateTasks()->with('beforeTasks')->get();
        $scheduleTemplateTaskIds = $schedule->templateTasks()->pluck('template_tasks.id')->toArray();
        $childrenIds = $schedule->templateTasks()->whereNotNull('template_task_parent_id')->pluck('template_tasks.id')->toArray();
        $listMilestone = $milestones->map(
            function ($milestone, $key) use ($schedule, $scheduleTemplateTasks, $scheduleTemplateTaskIds, $childrenIds, $milestonesLength, $milestones) {
                $templateTasks = $milestone->templateTasks()->whereIn('id', $scheduleTemplateTaskIds);
                $tasks = [];
                $templateTasks->each(function ($templateTask) use ($schedule, $scheduleTemplateTasks, &$tasks, $childrenIds) {
                    $duration = $scheduleTemplateTasks->where('id', $templateTask->id)->first()->pivot->duration;
                    $children = $this->getChildren($schedule, $templateTask->id);
                    $isChild = array_search($templateTask->id, $childrenIds) === false ? 0 : 1;
                    $item = [
                        'id'          => $templateTask->id,
                        'name'        => $templateTask->name,
                        'categories'  => $templateTask->categories()->get(['id', 'category_name']),
                        'duration'    => $duration,
                        'description' => $templateTask->description_of_detail,
                        'is_parent'   => $templateTask->is_parent,
                        'is_child'    => $isChild,
                        'is_day'      => 1,
                        'children'    => $children,
                    ];
                    array_push($tasks, $item);
                });
                $milestonePeriod = $milestone->is_week ? $milestone->period * 7 : $milestone->period;
                $nextMilestonePeriod = 0;
                $milestoneDuration = 0;
                if (($key !== $milestonesLength - 1)) {
                    $nextMilestonePeriod = $milestones[$key + 1]->is_week ? ($milestones[$key + 1]->period) * 7 : $milestones[$key + 1]->period;
                    $milestoneDuration = $nextMilestonePeriod - $milestonePeriod;
                } else {
                    foreach ($tasks as $task) {
                        $milestoneDuration += $task['duration'];
                    }
                }

                return [
                    'id'        => $milestone->id,
                    'name'      => $milestone->name,
                    'tasks'     => $tasks,
                    'duration'  => $milestoneDuration,
                ];
            }
        );

        return response($listMilestone);
    }

    public function getGanttChart($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $schedule = Schedule::findOrFail($id);
        $resMilestone = [];
        $resCategory = $this->getCategories($id);
        $schedule->milestones->each(function ($milestone) use (&$resMilestone) {
            $unit = $milestone->is_week ? '週後' : '日後';
            $tmpMilestone = [
                'id' => $milestone->id,
                'name' => $milestone->name,
                'timestamp' => $milestone->period.$unit,
            ];
            array_push($resMilestone, $tmpMilestone);
        });
        $tasks = DB::table('schedules')
            ->leftJoin('schedule_template_task', 'schedule_template_task.schedule_id', '=', 'schedules.id')
            ->leftJoin('template_tasks', 'template_tasks.id', '=', 'schedule_template_task.template_task_id')
            ->where(['schedules.id' => $id])
            ->get(['schedule_template_task.*', 'template_tasks.*']);
        $relations = [];
        $idTasks = [];
        $tasks->each(function ($task) use (&$relations, &$idTasks) {
            $parentId = $task->template_task_parent_id;
            $targetId = $task->template_task_id;
            if ($parentId !== null) {
                if (isset($relations[$parentId])) {
                    array_push($relations[$parentId], $targetId);
                } else {
                    $relations[$parentId] = [$targetId];
                }
            }

            array_push($idTasks, $targetId);
        });
        $resTask = [];
        $tasks->each(function ($task) use ($relations, &$resTask, $idTasks) {
            $unit = $task->unit;
            $time = $task->is_day ? '日' : '時間';
            if ($unit === 'companies') {
                $unit = '/企業';
            } else if ($unit === 'students') {
                $unit = '/学生';
            } else {
                $unit = '';
            }

            $id = $task->template_task_id;
            $idCategory = [];
            $afterTask = [];
            TemplateTask::findOrFail($id)->categories->each(function ($category) use (&$idCategory) {
                array_push($idCategory, $category->id);
            });
            $tmpAfterTask = DB::table('template_tasks')
                ->join('pivot_table_template_tasks', 'pivot_table_template_tasks.before_tasks', '=', 'template_tasks.id')
                ->where(['before_tasks' => $id])
                ->whereIn('after_tasks', $idTasks)
                ->get('after_tasks');
            if (!$tmpAfterTask->isEmpty()) {
                foreach ($tmpAfterTask as $val) {
                    array_push($afterTask, $val->after_tasks);
                }
            }

            $children = isset($relations[$id]) ? $relations[$id] : [];
            $tmpTask = [
                'id' => $id,
                'name' => $task->name,
                'milestoneId' => $task->milestone_id,
                'categoryIds' => $idCategory,
                'startAfter' => $task->start_time,
                'duration' => $task->duration,
                'children' => $children,
                'afterTask' => $afterTask,
                'effort' => $task->effort ? $task->effort.$time.$unit : '',
            ];
            array_push($resTask, $tmpTask);
        });

        return response()->json([
            'tasks' => $resTask,
            'milestones' => $resMilestone,
            'categories' => $resCategory,
        ]);
    }

    public function destroy($id)
    {
        try {
            $validate = Schedule::whereNull('jobfair_id')->where('id', $id)->first();
            if (!isset($validate)) {
                return response(['message' => 'invalid id'], 404);
            }

            $sch = Schedule::where('name', '=', $validate->name)->whereNotNull('jobfair_id')->get()->count();
            if ($sch > 0) {
                $data = ['message' => 'Exist a relation with schedule, can not delete!'];

                return response()->json($data, 422);
            }

            DB::beginTransaction();
            DB::table('milestone_schedule')->where('schedule_id', $id)->delete();
            DB::table('tasks')->where('schedule_id', $id)->update(['schedule_id' => null]);
            DB::table('list_members')->where('schedule_id', $id)->delete();

            Schedule::findOrFail($id)->delete();
            DB::commit();
        } catch (Exception $e) {
            report($e);
            DB::rollBack();
            $data = ['message' => 'Exist a relation with schedule, can not delete!', 'error' => $e->getMessage()];

            return response()->json($data, 422);
        }
    }

    private function createTemplateTaskParent($request)
    {
        $schedule = Schedule::findOrFail($request->schedule_id)->load('templateTasks');

        // Change duration
        $milestones = $schedule->milestones;
        foreach ($milestones as $item) {
            $day = $item->is_week === 1 ? $item->period * 7 : $item->period;
            $item['day'] = $day;
        }

        $milestones = $milestones->sortBy('day')->values();
        $IDs = $schedule->templateTasks->pluck('id')->toArray();
        $prerequisitesAll = DB::table('pivot_table_template_tasks')->select(['after_tasks', 'before_tasks'])
            ->whereIn('before_tasks', $IDs)->whereIn('after_tasks', $IDs)->get();
        foreach ($request->milestones as $milestone) {
            $index = $milestones->search(function ($element) use ($milestone) {
                return $element->id === $milestone['milestone_id'];
            });
            // the gap between two milestone is possible the time of this milestone
            // if it's the last milestone then the duration is forever
            $gap = $index < count($milestones) - 1 ?
                $milestones[$index + 1]->day - $milestones[$index]->day : PHP_INT_MAX;
            // min start time of all template task is milestone's start time
            $minStartTime = $milestones[$index]->day;
            $mapTaskIDToEndTime = collect([]);
            $templateTasks = $schedule->templateTasks()->where('milestone_id', $milestone['milestone_id'])->get()->filter(function ($task) {
                return $task->is_parent === 0;
            });
            $templateTaskIds = $templateTasks->pluck('id')->toArray();
            $prerequisites = $prerequisitesAll
                ->whereIn('before_tasks', $templateTaskIds)->whereIn('after_tasks', $templateTaskIds);
            $templateTasksOrder = taskRelation($templateTaskIds, $prerequisites);
            // if loop with this order, each before tasks of a template task will be handled before it
            foreach ($templateTasksOrder as $templateTaskId => $orderIndex) {
                //set new start time = the latest before task's end time + 1
                $newStartTime = $minStartTime;
                $templateTask = $templateTasks->where('id', $templateTaskId)->first();
                $templateTask->beforeTasks->each(function ($element) use (&$newStartTime, $mapTaskIDToEndTime, $templateTaskIds) {
                    if (in_array($element->id, $templateTaskIds)) {
                        $possibleStartTime = $mapTaskIDToEndTime[$element->id] + 1;
                        if ($newStartTime < $possibleStartTime) {
                            $newStartTime = $possibleStartTime;
                        }
                    }
                });
                // request must send all template tasks in a milestone
                if (!array_key_exists($templateTaskId, $milestone['template_tasks'])) {
                    return [
                        'msg'                      => 'you must specify duration of all template task in a milestone',
                        'missing_template_task_id' => $templateTaskId,
                    ];
                }

                if ($newStartTime > $minStartTime + $milestone['template_tasks'][$templateTaskId][0]) {
                    return [
                        'msg'                => 'invalid start time',
                        'template_task_id'   => $templateTaskId,
                        'minimum_start_time' => $newStartTime,
                    ];
                }

                $newStartTime = $minStartTime + $milestone['template_tasks'][$templateTaskId][0];
                $newEndTime = $newStartTime + $milestone['template_tasks'][$templateTaskId][1] - 1;
                $mapTaskIDToEndTime->put($templateTaskId, $newEndTime);
                if ($newEndTime > $minStartTime + $gap - 1) {
                    return [
                        'msg'              => 'invalid duration',
                        'template_task_id' => $templateTaskId,
                    ];
                }
            }
        }

        // if all milestones's duration is oke then update the durations
        foreach ($request->milestones as $milestone) {
            $templateTasks = $schedule->templateTasks()
                ->where('milestone_id', $milestone['milestone_id'])->where('template_tasks.is_parent', 0)->get(['template_tasks.id']);
            foreach ($templateTasks as $templateTask) {
                DB::table('schedule_template_task')->where('schedule_id', $request->schedule_id)
                    ->where('template_task_id', $templateTask->id)
                    ->update([
                        'duration'   => $milestone['template_tasks'][$templateTask->id][1],
                        'start_time' => $milestone['template_tasks'][$templateTask->id][0],
                    ]);
            }
        }

        // create template task parent
        foreach ($request->parent as $parent) {
            $idCategory = [];
            $milestone = TemplateTask::find($parent['children'][0])->milestone_id;
            foreach ($parent['children'] as $child) {
                $id = TemplateTask::find($child)->milestone_id;
                if ($milestone !== $id) {
                    return ['message' => 'invalid milestone'];
                }

                $temp = TemplateTask::find($child)->categories()->pluck('id')->toArray();
                $idCategory = array_merge($idCategory, $temp);
            }

            $idCategory = array_unique($idCategory);
            $newTemplateTask = TemplateTask::create([
                'name'         => $parent['name'],
                'is_parent'    => true,
                'milestone_id' => $milestone,
            ]);

            $newTemplateTask->categories()->attach(array_values($idCategory));
            // add template task parent to table schedule_template_task
            $schedule->templateTasks()->attach($newTemplateTask);
            $schedule->templateTasks()->updateExistingPivot($parent['children'], [
                'template_task_parent_id' => $newTemplateTask->id,
            ]);
            TemplateTask::whereIn('id', $parent['children'])->update(['has_parent' => 1]);
        }

        $this->calculateParentDuration($request->schedule_id);

        return [
            'msg' => 'ok',
        ];
    }

    private function calculateParentDuration($scheduleId)
    {
        $schedule = Schedule::findOrFail($scheduleId);
        $templateTasks = $schedule->templateTasks;
        $parentTemplateTasks = $templateTasks->where('is_parent', 1);
        $parentTemplateTasks = $parentTemplateTasks->each(function ($templateTask) use ($templateTasks, $schedule) {
            $minStartTime = PHP_INT_MAX;
            $maxDuration = 1;
            $countChild = 0;
            $templateTasks->filter(function ($element) use ($templateTask) {
                return $element->pivot->template_task_parent_id === $templateTask->id;
            })->each(function ($child) use (&$minStartTime, &$countChild) {
                if ($child->pivot->start_time < $minStartTime) {
                    $minStartTime = $child->pivot->start_time;
                }

                $countChild++;
            })->each(function ($child) use (&$maxDuration, $minStartTime) {
                $duration = $child->pivot->start_time - $minStartTime + $child->pivot->duration;
                if ($duration > $maxDuration) {
                    $maxDuration = $duration;
                }
            });
            if ($countChild > 0) {
                $schedule->templateTasks()->updateExistingPivot($templateTask, [
                    'start_time' => $minStartTime,
                    'duration'   => $maxDuration,
                ], false);
            }
        });
    }

    public function deleteTemplateTaskParent(Request $request, $id)
    {
        $templateTaskParent = TemplateTask::findOrFail($id);
        DB::table('schedule_template_task')->where('template_task_parent_id', $id)->where('schedule_id', $request->schedule_id)->update([
            'template_task_parent_id' => null,
        ]);
        $templateTaskParent->schedules()->detach();
        $templateTaskParent->categories()->detach();
        $templateTaskParent->delete();

        return response()->json('OK');
    }

    public function getListTemplateTasks($id)
    {
        $idTemplateTask = DB::table('schedule_template_task')->where('schedule_id', $id)->pluck('template_task_id');
        $schedule = Schedule::with([
            'milestones:id,name,is_week,period',
            'milestones.templateTasks' => function ($templateTask) use ($idTemplateTask) {
                $templateTask->whereIn('template_tasks.id', $idTemplateTask)->select(['id', 'name', 'milestone_id', 'is_parent']);
            },
        ])->findOrFail($id, ['id', 'name']);
        foreach ($schedule->milestones as $item) {
            $day = $item->is_week === 1 ? $item->period * 7 : $item->period;
            $item['day'] = $day;
        }

        $schedule->milestones = $schedule->milestones->sortBy('day')->values();
        // return response()->json($schedule->milestones);
        foreach ($schedule->milestones as $milestone) {
            $index = $schedule->milestones->search(function ($element) use ($milestone) {
                return $element->id === $milestone['id'];
            });
            // the gap between two milestone is possible the time of this milestone
            // if it's the last milestone then the duration is forever
            $gap = $index < count($schedule->milestones) - 1 ?
                $schedule->milestones[$index + 1]->day - $schedule->milestones[$index]->day : PHP_INT_MAX;
            $milestone['gap'] = $gap;
        }

        foreach ($schedule->milestones as $milestone) {
            foreach ($milestone->templateTasks as $templateTask) {
                $taskInfo = DB::table('schedule_template_task')->where('template_task_id', $templateTask->id)
                    ->where('schedule_id', $id)->first();
                $templateTask['parent'] = $taskInfo->template_task_parent_id === null ? 0 : $taskInfo->template_task_parent_id;
                $templateTask['duration'] = [
                    $taskInfo->start_time === null ? 1 : $taskInfo->start_time,
                    $taskInfo->duration === null ? 1 : $taskInfo->duration,
                ];
                $temp = TemplateTask::findOrFail($templateTask->id);
                $templateTask['categories'] = $temp->categories;
                $templateTask['effort'] = $temp->effort;
                $templateTask['is_day'] = $temp->is_day;
                $templateTask['unit'] = $temp->unit;
                $templateTask['beforeTasks'] = $temp->beforeTasks->pluck('id');
                $templateTask['afterTasks'] = $temp->afterTasks->pluck('id');
            }
        }

        return $schedule->milestones->toArray();
    }
}
