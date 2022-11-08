<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class MemberDetailController extends Controller
{
    public function checkCategoryExist($categories, $taskCategory)
    {
        foreach ($categories as $category) {
            if ($category->category_name === $taskCategory->category_name) {
                return true;
            }
        }

        return false;
    }

    public function memberDetail($id)
    {
        // $jobfairs = [];
        // $categories = [];
        // foreach ($user->schedules as $schedule) {
        //     array_push($jobfairs, $schedule->jobfair);
        // }

        // $user->jobfairs = $jobfairs;
        // foreach ($user->tasks as $task) {
        //     $taskCategories = $task->categories;
        //     if (!$taskCategories) {
        //         continue;
        //     }

        //     foreach ($taskCategories as $taskCategory) {
        //         if (!$this->checkCategoryExist($categories, $taskCategory)) {
        //             array_push($categories, $taskCategory);
        //         }
        //     }
        // }
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        // $user->categories = $categories;
        $user = User::findOrFail($id);

        $user = $user->load('categories');

        $tasks = $user->tasks;
        $schedules = $tasks->map(fn($task) => $task->schedule->load('jobfair'));
        $user['schedules'] = $schedules->all();

        return $user;
    }

    public function deleteMember($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $user = User::findOrFail($id);
        if ($user->role !== 1) {
            DB::table('list_members')->where('user_id', $id)->delete();
            DB::table('tasks')->where('user_id', $id)->update(['user_id' => null]);
            DB::table('assignments')->where('user_id', $id)->delete();

            foreach ($user->jobfairs as $jf) {
                if (count($jf->admins) === 1) {
                    $jf->delete();
                }
            }

            $user->jobfairs()->detach();
            User::findOrFail($id)->delete();

            return response()->json('Delete Success');
        }

        return response()->json('Error', 403);
    }
}
