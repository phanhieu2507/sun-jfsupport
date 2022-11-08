<?php

namespace Database\Seeders;

use App\Imports\CategoriesImport;
use App\Imports\CompaniesImport;
use App\Imports\MilestonesImport;
use App\Imports\TemplateTasksImport;
use App\Imports\UsersImport;
use Excel;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // first 3 users in 3 role
        // $JFadmin = User::create([
        //     'name'           => 'Sun Asterisk',
        //     'email'          => 'jobfair@sun-asterisk.com',
        //     'password'       => Hash::make('12345678'),
        //     'avatar'         => 'images/avatars/default.jpg',
        //     'role'           => 1,
        //     'chatwork_id'    => Str::random(10),
        //     'remember_token' => null,
        //     'updated_at'     => now(),
        //     'created_at'     => now(),
        // ]);

        // User::create([
        //     'name'           => 'JF Admin',
        //     'email'          => 'AnAdmin@sun-asterisk.com',
        //     'password'       => Hash::make('12345678'),
        //     'avatar'         => 'images/avatars/default.jpg',
        //     'role'           => 2,
        //     'chatwork_id'    => Str::random(10),
        //     'remember_token' => null,
        //     'updated_at'     => now(),
        //     'created_at'     => now(),
        // ]);
        // User::create([
        //     'name'           => 'Member',
        //     'email'          => 'AMember@sun-asterisk.com',
        //     'password'       => Hash::make('12345678'),
        //     'avatar'         => 'images/avatars/default.jpg',
        //     'role'           => 3,
        //     'chatwork_id'    => Str::random(10),
        //     'remember_token' => null,
        //     'updated_at'     => now(),
        //     'created_at'     => now(),
        // ]);
        // $milestones = [
        //     [
        //         '会社紹介',
        //         0,
        //         0,
        //     ],
        //     ['オープンSCP', 4, 0],
        //     ['プロファイル選択ラウンドの結果', 2, 1],
        //     ['1回目の面接', 3, 1],
        //     [' 1回目の面接結果', 4, 1],
        //     ['2回目の面接', 5, 1],
        //     [' 2回目の面接結果', 6, 1],
        // ];
        // // create category + category detail
        // Category::factory()->has(CategoryDetail::factory()->count(3))->create(['category_name' => '1次面接練習']);
        // Category::factory()->has(CategoryDetail::factory()->count(3))->create(['category_name' => 'TC業務']);
        // Category::factory()->has(CategoryDetail::factory()->count(3))->create(['category_name' => '企業担当']);
        // Category::factory()->has(CategoryDetail::factory()->count(3))->create(['category_name' => '管理者']);
        // Category::factory()->has(CategoryDetail::factory()->count(3))->create(['category_name' => 'レビュアー']);
        // // create users
        // User::factory(30)->create();
        // User::all()->each(function ($user) {
        //     $user->categories()->attach(Category::all()->random(2));
        // });
        // // create template milestones
        // foreach ($milestones as $milestone) {
        //     Milestone::create([
        //         'name'    => $milestone[0],
        //         'period'  => $milestone[1],
        //         'is_week' => $milestone[2],
        //     ]);
        // }

        // // create template tasks with fk to template milestones and categories
        // foreach (Milestone::all() as $milestone) {
        //     TemplateTask::factory(5)->for($milestone)->hasAttached(Category::all()->random())->create();
        // }

        // // create 3 template schedules
        // foreach (range(0, 2) as $index) {
        //     $schedule = Schedule::factory()->hasAttached(Milestone::all()->random(rand(3, Milestone::all()->count())))->create();
        //     foreach ($schedule->milestones as $milestone) {
        //         $schedule->templateTasks()->attach($milestone->templateTasks->random(rand(1, $milestone->templateTasks->count())));
        //     }
        // }

        // //create 3 jobfairs
        // Jobfair::factory(3)->create();
        // Jobfair::all()->first()->update([
        //     'jobfair_admin_id' => $JFadmin->id,
        // ]); // first JF assign to $JFadmin
        // foreach (Jobfair::all() as $jobfair) {
        //     // random template schedule
        //     $templateSchedule = Schedule::where('jobfair_id', null)->get()->random(1)->first();
        //     $schedule = Schedule::factory()->create([
        //         'jobfair_id' => $jobfair->id,
        //         'name'       => $templateSchedule->name,
        //     ]);

        //     $schedule->users()->attach(User::where('id', '<>', $jobfair->jobfair_admin_id)->get()->random(10));

        //     $schedule->milestones()->attach($templateSchedule->milestones);

        //     foreach ($templateSchedule->templateTasks as $templateTask) {
        //         //create tasks
        //         $numDates = $templateTask->milestone->is_week ? $templateTask->milestone->period * 7 : $templateTask->milestone->period;
        //         $startTime = date('Y-m-d', strtotime($jobfair->start_date . ' + ' . $numDates . 'days'));
        //         $duration = 0;
        //         if ($templateTask->unit === 'students') {
        //             $duration = (float) $templateTask->effort * $jobfair->number_of_students;
        //         } else if ($templateTask->unit === 'none') {
        //             $duration = (float) $templateTask->effort;
        //         } else {
        //             $duration = (float) $templateTask->effort & $jobfair->number_of_companies;
        //         }

        //         $duration = $templateTask->is_day ? $duration : ceil($duration / 24);
        //         $newTask = Task::create([
        //             'name'             => $templateTask->name,
        //             'start_time'       => $startTime,
        //             'end_time'         => date('Y-m-d', strtotime($startTime . ' + ' . $duration . 'days')),
        //             'status'           => collect([
        //                 '未着手',
        //                 '進行中',
        //                 '完了',
        //                 '中断',
        //                 '未完了',
        //             ])->random(),

        //             'milestone_id'     => $templateTask->milestone_id,
        //             'schedule_id'      => $schedule->id,
        //             'template_task_id' => $templateTask->id,
        //         ]);
        //         $newTask->categories()->attach($templateTask->categories);
        //         // assign to jobfair's members whose have same category
        //         $users = $schedule->users()->whereHas('categories', function (Builder $query) use ($newTask) {
        //             $query->whereIn('id', $newTask->categories()->pluck('id'));
        //         })->get();
        //         $users = $users->random(rand(0, $users->count()));
        //         $newTask->users()->attach($users, [
        //             'notification'   => 'thong bao',
        //             'join_date'      => now(),
        //             'completed_date' => null,
        //         ]);
        //     }
        // }

        // $this->call([FileSeeder::class]);
        $this->call(SuperAdminSeeder::class);
        $this->call(AdminablesTableSeeder::class);
        Excel::import(new MilestonesImport(), base_path('file/milestone.ods'), null, \Maatwebsite\Excel\Excel::ODS);
        Excel::import(new CategoriesImport(), base_path('file/categories.ods'), null, \Maatwebsite\Excel\Excel::ODS);
        Excel::import(new TemplateTasksImport(), base_path('file/template_task.ods'), null, \Maatwebsite\Excel\Excel::ODS);
        Excel::import(new UsersImport(), base_path('file/users.ods'), null, \Maatwebsite\Excel\Excel::ODS);
        Excel::import(new CompaniesImport(), base_path('file/companies.ods'), null, \Maatwebsite\Excel\Excel::ODS);
        // $schedule = Schedule::create([
        //     'name' => 'Template Schedule',
        // ]);
        // $milestones = Milestone::all();
        // // create schedule
        // $schedule->milestones()->attach($milestones->pluck('id')->toArray());
        // $templateTasks = TemplateTask::whereIn('milestone_id', $milestones->pluck('id')->toArray())
        //     ->get()->random(80);
        // $schedule->templateTasks()->attach($templateTasks->pluck('id')->toArray());
        // // random 3 parents
        // $schedule->templateTasks->random(6)->each(
        //     function ($parent) use ($schedule) {
        //         $parent->is_parent = true;
        //         $parent->has_parent = false;
        //         $parent->save();
        //         // each parent random 2 child

        //         $child = $parent->categories->first()->templateTasks()->where('has_parent', 0)
        //             ->where('is_parent', 0)->whereHas('schedules', function ($query) use ($schedule) {
        //                 $query->where('schedules.id', $schedule->id);
        //             })->where('milestone_id', $parent->milestone_id)->get();
        //         $child->random(min(count($child), 3))->each(function ($templateTask) use ($schedule, $parent) {
        //             $templateTask->has_parent = true;
        //             $templateTask->save();
        //             DB::table('schedule_template_task')->where('schedule_id', $schedule->id)
        //                 ->where('template_task_id', $templateTask->id)->update([
        //                     'template_task_parent_id' => $parent->id,
        //                 ]);
        //         });
        //     }
        // );
    }
}
