<?php

namespace Database\Factories;

use App\Models\Jobfair;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobfairFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Jobfair::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->unique()->name(),
            'start_date' => $this->faker->randomElement(['2021-09-17', '2021-10-17', '2022-01-12']),
            'number_of_students' => $this->faker->numberBetween(0, 100),
            'number_of_companies' => $this->faker->numberBetween(0, 100),
        ];
    }
}
