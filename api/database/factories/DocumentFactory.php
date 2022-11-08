<?php

namespace Database\Factories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Document::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $poly = [
            'App\Models\Jobfair',
            // 'App\Models\Task',
        ];

        return [
            'document_type' => $this->faker->randomElement($poly),
            'document_id' => $this->faker->numberBetween(1, 4),
            'created_at' => $this->faker->date(),
            'updated_at' => $this->faker->date(),
            'name' => $this->faker->name(),
            'link' => $this->faker->url(),
            'path' => '/',
            'is_file' => $this->faker->boolean(),
            'authorId' => $this->faker->numberBetween(1, 4),
            'updaterId' => $this->faker->numberBetween(1, 4),
        ];
    }
}
