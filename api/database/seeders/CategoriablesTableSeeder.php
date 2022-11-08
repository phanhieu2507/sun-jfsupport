<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriablesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $categoriable = [
            'App\Models\User',
            'App\Models\Task',
        ];

        for ($i = 0; $i < 5; $i++) {
            DB::table('categoriables')->insert([
                'categoriable_type' => $faker->randomElement($categoriable),
                'categoriable_id' => $i + 1,
                'category_id' => $faker->numberBetween(1, 5),
            ]);
        }
    }
}
