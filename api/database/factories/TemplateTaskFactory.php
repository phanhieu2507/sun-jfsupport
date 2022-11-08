<?php

namespace Database\Factories;

use App\Models\Milestone;
use App\Models\TemplateTask;
use Illuminate\Database\Eloquent\Factories\Factory;

class TemplateTaskFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TemplateTask::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->unique()->name(),
            'effort' => $this->faker->numberBetween(1, 10),
            'is_day' => $this->faker->boolean(),
            'unit' => $this->faker->randomElement(['students', 'companies', 'none']),
            'description_of_detail' => $this->faker->text(),
            'milestone_id' => Milestone::factory(),
            'is_duplicated' => $this->faker->boolean(),

        ];
    }
}
