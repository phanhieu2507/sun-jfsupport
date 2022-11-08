<?php

namespace Database\Seeders;

use App\Models\Document;
use Illuminate\Database\Seeder;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Document::factory(50)->create()->each(function ($folder) {
            if (!$folder->is_file) {
                $path = $folder->path;
                $path .= $folder->name;
                Document::factory(rand(1, 5))->create([
                    'path' => $path,
                ])->each(function ($folder2) {
                    if (!$folder2->is_file) {
                        $path2 = $folder2->path;
                        $path2 .= '/';
                        $path2 .= $folder2->name;
                        Document::factory(rand(0, 5))->create([
                            'path' => $path2,
                        ]);
                    }
                });
            }
        });
    }
}
