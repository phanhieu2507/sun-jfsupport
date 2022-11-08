<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\User;
use Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;

class UsersImport implements ToModel
{
    private $categories;

    public function __construct()
    {
        $this->categories = Category::select('id', 'category_name')->get();
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $arr = explode(',', $row[3]);
        $category = $this->categories->whereIn('category_name', $arr)->pluck('id');
        if (config('app.env') === 'production') {
            $newUser = User::create([
                'name'                  => trim($row[1]),
                'email'                 => trim($row[2]),
                'password'              => Hash::make('12345678'),
                'role'                  => 2,
                'chatwork_id'           => strlen(trim($row[4])) !== 11 ? null : trim($row[4]),
            ]);
        } else {
            $newUser = User::create([
                'name'                  => trim($row[1]),
                'email'                 => trim($row[2]),
                'password'              => Hash::make('12345678'),
                'role'                  => 2,
                'chatwork_id'           => Str::random(11),
            ]);
        }

        $newUser->categories()->attach($category);

        return $newUser;
    }
}
