<?php

namespace App\Http\Controllers;

use App\Http\Requests\TemplateTaskRequest;
use App\Models\Category;
use App\Models\Jobfair;
use App\Models\Milestone;
use App\Models\TemplateTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use stdClass;

class TemplateTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $templateTasks = TemplateTask::with(['categories:id,category_name', 'milestone:id,name'])->where('is_parent', 0)
            ->latest()
            ->get(['template_tasks.id', 'template_tasks.name', 'template_tasks.milestone_id', 'template_tasks.created_at']);

        return response()->json($templateTasks);
    }

    public function getTemplateTaskNotAdded($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $task = Jobfair::with([
            'schedule.tasks' => function ($q) {
                $q->select('template_task_id', 'schedule_id');
            },
        ])->findOrFail($id);

        $templateTask = TemplateTask::whereNotIn('id', $task->schedule->tasks->pluck('template_task_id'))->where('is_parent', 0)
            ->with(['categories:id,category_name', 'milestone:id,name'])
            ->orderBy('template_tasks.id', 'DESC')
            ->get(['id', 'name', 'milestone_id']);

        return response()->json($templateTask);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TemplateTaskRequest $request)
    {
        $newTemplateTask = TemplateTask::create([
            'name'                  => $request->name,
            'description_of_detail' => $request->description_of_detail,
            'milestone_id'          => $request->milestone_id,
            'is_day'                => $request->is_day,
            'unit'                  => $request->unit,
            'effort'                => $request->effort,
        ]);
        $newTemplateTask->categories()->attach($request->category_id);
        if (!empty($request->beforeTasks)) {
            $newTemplateTask->beforeTasks()->attach($request->beforeTasks);
        }

        if (!empty($request->afterTasks)) {
            $newTemplateTask->afterTasks()->attach($request->afterTasks);
        }

        return $newTemplateTask;

        // $newTemplateTask = TemplateTask::create($request->validated());
        // $newTemplateTask->categories()->attach($request->category_id);
        // if (!empty($request->beforeTasks)) {
        //     $newTemplateTask->beforeTasks()->attach($request->beforeTasks);
        // }

        // if (!empty($request->afterTasks)) {
        //     $newTemplateTask->afterTasks()->attach($request->afterTasks);
        // }

        // return $newTemplateTask;
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

        $templateTask = TemplateTask::with(['categories:id,category_name', 'milestone:id,name'])
            ->findOrFail($id);

        return response()->json($templateTask);
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
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $templateTask = TemplateTask::findOrFail($id);

        // Check if duplicate name
        $existTemp = TemplateTask::whereRaw('BINARY `name`= ?', [$request->name])
            ->where('id', '<>', $id)->get();
        if (count($existTemp)) {
            return response()->json(['message' => 'duplicated name'], 422);
        }

        // validate relation
        $templateTasks = TemplateTask::all();
        $milestones = Milestone::all();
        orderMilestonesByPeriod($milestones);
        $milestones = $milestones->pluck('id')->toArray();
        $currentTemplateTaskMilestone = array_search($templateTask->milestone_id, $milestones);
        $prerequisites = DB::table('pivot_table_template_tasks')->where('before_tasks', '<>', $id)
            ->where('after_tasks', '<>', $id)->select(['after_tasks', 'before_tasks'])->get();
        foreach ($request->beforeTasks as $beforeTaskID) {
            if (
                array_search(
                    $templateTasks->where('id', $beforeTaskID)->first()->milestone_id,
                    $milestones
                ) > $currentTemplateTaskMilestone
            ) {
                return response([
                    'error' => 'invalid before tasks',
                ], 400);
            }

            $newPrerequisite = new stdClass();
            $newPrerequisite->before_tasks = $beforeTaskID;
            $newPrerequisite->after_tasks = $id;
            $prerequisites->push($newPrerequisite);
        }

        foreach ($request->afterTasks as $afterTaskID) {
            if (
                array_search(
                    $templateTasks->where('id', $afterTaskID)->first()->milestone_id,
                    $milestones
                ) < $currentTemplateTaskMilestone
            ) {
                return response([
                    'error' => 'invalid after tasks',
                ], 400);
            }

            $newPrerequisite = new stdClass();
            $newPrerequisite->before_tasks = $id;
            $newPrerequisite->after_tasks = $afterTaskID;
            $prerequisites->push($newPrerequisite);
        }

        if (taskRelation($templateTasks->pluck('id')->toArray(), $prerequisites) === 'invalid') {
            return response([
                'error' => 'invalid relations',
            ], 400);
        }

        $templateTask->update($request->all());
        $templateTask->categories()->sync($request->category_id);
        $templateTask->beforeTasks()->sync($request->beforeTasks);
        $templateTask->afterTasks()->sync($request->afterTasks);

        return response()->json(['message' => 'Edit Successfully'], 200);
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

        $templateTasks = TemplateTask::findOrFail($id);
        $templateTasks->categories()->detach();
        $templateTasks->beforeTasks()->detach();
        $templateTasks->afterTasks()->detach();
        $templateTasks->delete();

        return response()->json(['message' => 'Delete Successfully'], 200);
    }

    public function getCategoriesTasks()
    {
        $categories = Category::where('category_name', '<>', 'Reviewer')->get();

        return response()->json($categories);
    }

    public function getBeforeTasks($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $beforeTasks = TemplateTask::with('beforeTasks:id,name')->findOrFail($id, ['id', 'name']);

        return response()->json($beforeTasks);
    }

    public function getListBeforeAndAfterTemplateTask($id)
    {
        //add dates to all milestones
        $listMilestones = Milestone::all();
        foreach ($listMilestones as $item) {
            $day = $item->is_week === 1 ? $item->period * 7 : $item->period;
            $item['day'] = $day;
        }

        $milestone = $listMilestones->find($id);
        if (!$milestone) {
            return response(['message' => 'invalid id'], 404);
        }

        //milestone meets before the condition
        $idMilestoneMeetsBefore = [];
        $idMilestoneMeetsAfter = [];
        foreach ($listMilestones as $item) {
            if ($item->day <= $milestone->day) {
                array_push($idMilestoneMeetsBefore, $item->id);
            }

            if ($item->day >= $milestone->day) {
                array_push($idMilestoneMeetsAfter, $item->id);
            }
        }

        $listTemplateTaskBefores = TemplateTask::whereIn('milestone_id', $idMilestoneMeetsBefore)->where('is_parent', '=', 0)->get();
        $listTemplateTaskAfters = TemplateTask::whereIn('milestone_id', $idMilestoneMeetsAfter)->where('is_parent', '=', 0)->get();

        return response(
            [
                'listTemplateTaskBefores' => $listTemplateTaskBefores,
                'listTemplateTaskAfters' => $listTemplateTaskAfters,
            ]
        );
    }

    public function getAfterTasks($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $afterTasks = TemplateTask::with('afterTasks:id,name')->findOrFail($id, ['id', 'name']);

        return response()->json($afterTasks);
    }

    public function checkNameExisted(Request $request)
    {
        return TemplateTask::where('name', '=', $request->name)->where('is_parent', 0)->get();
    }
}
