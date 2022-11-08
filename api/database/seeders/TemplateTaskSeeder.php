<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Milestone;
use App\Models\Schedule;
use App\Models\TemplateTask;
use Illuminate\Database\Seeder;

class TemplateTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $milestones = Milestone::factory(5)->create();
        $schedule = Schedule::factory()->hasAttached($milestones)->create([
            'id' => 100,
        ]);
        $index = 100;
        foreach ($milestones as $milestone) {
            for ($i = 0; $i < 3; $i++) {
                $templateTask = TemplateTask::factory()->for($milestone)->hasAttached(Category::all()->random(2))->create([
                    'id' => $index,
                ]);
                $schedule->templateTasks()->attach($templateTask);
                $index++;
            }
        }

        for ($i = 100; $i < $index - 1; $i++) {
            TemplateTask::find($i)->afterTasks()->attach(TemplateTask::find($i + 1));
        }
    }
}
