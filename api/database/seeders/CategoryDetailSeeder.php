<?php

namespace Database\Seeders;

use App\Models\CategoryDetail;
use Illuminate\Database\Seeder;

class CategoryDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CategoryDetail::factory()->count(5)->create();
    }
}
