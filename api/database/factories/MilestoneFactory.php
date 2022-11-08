<?php

namespace Database\Factories;

use App\Models\Milestone;
use Illuminate\Database\Eloquent\Factories\Factory;

class MilestoneFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Milestone::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => preg_replace('/\s/', '_', $this->faker->unique()->name()),
            'period' => $this->faker->numberBetween(1, 50),
            'is_week' => false,
        ];
    }
}
