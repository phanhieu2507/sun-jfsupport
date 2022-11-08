<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\MemberEdited;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $members = [];
        // if (Auth::user()->role === 2) {
        //     return User::select('id', 'name', 'email', 'created_at')->where('role', '=', 2)->orWhere('role', '=', 3)->get();
        // } else if (Auth::user()->role === 1) {
        //     return User::select('id', 'name', 'email', 'created_at')->get();
        // }

        // return User::select('id', 'name', 'email', 'created_at')->where('role', '=', 3)->get();
        if (Auth::user()->role === 1) {
            $users = User::select('id', 'name', 'email', 'created_at')->where('role', '!=', 1)->where('email', '<>', Auth::user()->email)->get();
            foreach ($users as $user) {
                array_push($members, User::find($user->id)->load('categories'));
            }

            return $members;
        }

        // return User::select('id', 'name', 'email', 'created_at')->where('role', '=', 3)->where('email', '<>', Auth::user()->email)->get();
        $users = User::select('id', 'name', 'email', 'created_at')->where('role', '=', 2)->get();
        foreach ($users as $user) {
            array_push($members, User::find($user->id)->load('categories'));
        }

        return $members;
    }

    public function showMember($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $user = User::findOrFail($id);
        $categories = $user->categories;

        return [
            'user'       => $user,
            'categories' => $categories,
        ];
    }

    public function update(Request $request, $id)
    {
        $rules = [
            'name'  => 'required|min:3|max:50',
            'email' => 'required|min:10|max:100',
            'email' => Rule::unique('users')->ignore($id)->where('email', request('email')),
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $user = User::findOrFail($id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->categories()->sync($request->categories);
        $user->save();

        $user->notify(new MemberEdited(auth()->user()));

        return $user->categories;
    }

    public function getTaskByID($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $tasks = User::findOrFail($id)->tasks()
            ->with([
                'schedule.tasks' => function ($query) {
                    $query->oldest('tasks.end_time');
                },
                'categories',
            ])->get();

        $currentDate = strtotime(date('Y-m-d'));
        foreach ($tasks as $task) {
            $task->jobfair_name = $task->schedule->jobfair->name;

            $latestTask = $task->schedule->tasks->last();
            if ($currentDate > strtotime($latestTask->end_time)) {
                unset($task);
            }
        }

        return $tasks;
    }

    public function getMember()
    {
        $user = User::select('id', 'name')->where('role', '=', 2)->get();

        return response()->json($user);
    }
}
