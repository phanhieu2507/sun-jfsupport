<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name'           => 'Super Admin',
            'email'          => 'superadmin@jf-support.com',
            'password'       => Hash::make('#alXKEzCEpG@'),
            'avatar'         => 'images/avatars/default.jpg',
            'role'           => 1,
            'chatwork_id'    => config('slack.config.superAdminID'),
            'remember_token' => null,
            'updated_at'     => now(),
            'created_at'     => now(),
        ]);
    }
}
