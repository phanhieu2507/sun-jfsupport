<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminablesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('adminables')->insert([
            'adminable_type' => 'App\Models\Jobfair',
            'adminable_id' => 1,
            'user_id' => 4,
        ]);

        DB::table('adminables')->insert([
            'adminable_type' => 'App\Models\Jobfair',
            'adminable_id' => 2,
            'user_id' => 7,
        ]);
    }
}
