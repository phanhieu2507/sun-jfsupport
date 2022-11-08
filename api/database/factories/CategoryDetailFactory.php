<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\CategoryDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryDetailFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CategoryDetail::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'category_item' => $this->faker->name(),
            'category_id' => Category::factory(),
        ];
    }
}
