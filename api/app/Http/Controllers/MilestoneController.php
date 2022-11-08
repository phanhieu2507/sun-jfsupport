<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MilestoneController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = DB::table('milestones')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = [
            'name'    => 'required|regex:/^[^\s]*$/|unique:milestones,name|min:0|max:100',
            'period'  => 'required|numeric|min:0|max:3000',
            'is_week' => 'required|numeric|min:0|max:1',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();

        return Milestone::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $rules = [
            'id' => 'exists:App\Models\Milestone,id',
        ];
        $validator = Validator::make([
            'id' => $id,
        ], $rules);
        $validator->validate();
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Milestone::findOrFail($id);
    }

    //use to get milestone with tasks
    public function getInfoMilestones($id)
    {
        // $schedule = Schedule::find($id);

        // return $schedule->milestones->map(function ($milestone) {
        //     $templateTasksOfMilestone = $milestone->templateTasks;
        //     $milestone['tasks'] = $templateTasksOfMilestone;
        //     $templateTasksOfMilestone->map(function ($task) {
        //         return $task->categories;
        //     });

        //     return $milestone;
        // });
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $templateTasks = Schedule::findOrFail($id)->templateTasks;
        $templateTaskIds = $templateTasks->pluck('id')->toArray();
        $result = Schedule::with('milestones')->with('milestones.templateTasks', function ($query) use ($templateTaskIds) {
            $query->whereIn('id', $templateTaskIds)->where(function ($q) {
                $q->where('is_parent', 1)->orWhere('has_parent', 0);
            })->with('categories');
        })->findOrFail($id);
        $prerequisites = DB::table('pivot_table_template_tasks')->select(['after_tasks', 'before_tasks'])
            ->whereIn('before_tasks', $templateTaskIds)->whereIn('after_tasks', $templateTaskIds)->get();
        $templateTasksOrder = taskRelation($templateTaskIds, $prerequisites);
        $result = $result->milestones->map(function ($milestone) use ($templateTasks, $templateTasksOrder) {
            $milestone->templateTasks->map(function ($templateTask) use ($templateTasks, $templateTasksOrder) {
                if ($templateTask->is_parent === 1) {
                    $templateTask->children = $templateTasks->filter(function ($element) use ($templateTask) {
                        return $element->pivot->template_task_parent_id === $templateTask->id;
                    })->sort(function ($child1, $child2) use ($templateTasksOrder) {
                        $index1 = array_search($child1->id, array_keys($templateTasksOrder));
                        $index2 = array_search($child2->id, array_keys($templateTasksOrder));
                        if ($index1 === $index2) {
                            return 0;
                        }

                        if ($index1 < $index2) {
                            return -1;
                        }

                        return 1;
                    });
                }

                return $templateTask;
            });

            return $milestone;
        });

        return $result;
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
        $rules = [
            'name'    => 'regex:/^[^\s]*$/',
            'name'    => [
                Rule::unique('milestones')->whereNot('id', $id),
            ],
            'period'  => 'numeric|min:0|max:3000',
            'is_week' => 'numeric|min:0|max:1',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Milestone::findOrFail($id)->update($request->all());
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

        Milestone::findOrFail($id)->delete();

        return response()->json([
            'success' => 'Record has been deleted successfully!',
        ]);
    }

    public function checkUniqueEdit($id, $name, $period, $isWeek)
    {
        $name = Milestone::where('id', '<>', $id)->where('name', '=', $name)->get();
        $duplicateIsWeek = [];
        $duplicateNotIsWeek = [];
        $duplicate = Milestone::where('id', '<>', $id)->where('period', '=', $period)->where('is_week', '=', $isWeek)->get();
        if (count($duplicate) > 0) {
            return response(['message' => 'invalid period', 'name' => $name]);
        }

        if ($isWeek) {
            $duplicateIsWeek = Milestone::where('id', '<>', $id)->where('period', '=', $period * 7)->where('is_week', '=', 0)->get();
        } else {
            $duplicateNotIsWeek = Milestone::where('id', '<>', $id)->where('period', '=', $period / 7)->where('is_week', '=', 1)->get();
        }

        if (count($duplicateNotIsWeek) > 0 || count($duplicateIsWeek) > 0) {
            return response(['message' => 'invalid period', 'name' => $name]);
        }

        return response(['message' => 'OK', 'name' => $name]);
    }

    public function checkUniqueAdd($name, $period, $isWeek)
    {
        $name = Milestone::where('name', '=', $name)->get();
        $duplicateIsWeek = [];
        $duplicateNotIsWeek = [];
        $duplicate = Milestone::where('period', '=', $period)->where('is_week', '=', $isWeek)->get();
        if (count($duplicate) > 0) {
            return response(['message' => 'invalid period', 'name' => $name]);
        }

        if ($isWeek) {
            $duplicateIsWeek = Milestone::where('period', '=', $period * 7)->where('is_week', '=', 0)->get();
        } else {
            $duplicateNotIsWeek = Milestone::where('period', '=', $period / 7)->where('is_week', '=', 1)->get();
        }

        if (count($duplicateNotIsWeek) > 0 || count($duplicateIsWeek) > 0) {
            return response(['message' => 'invalid period', 'name' => $name]);
        }

        return response(['message' => 'OK', 'name' => $name]);
    }

    public function getSearch(Request $request)
    {
        $s = $request->input('s');
        if ($request->input('s')) {
            $data = DB::table('milestones')
                ->where('name', 'LIKE', '%' + $s + '%')
                ->orderBy('id', 'asc')
                ->get();

            return response()->json($data);
        }

        $data = DB::table('milestones')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($data);
    }

    public function checkMilestoneNameExisted(Request $request)
    {
        return Milestone::where('name', '=', $request->name)->first();
    }
}
