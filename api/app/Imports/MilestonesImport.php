<?php

namespace App\Imports;

use App\Models\Milestone;
use Maatwebsite\Excel\Concerns\ToModel;

class MilestonesImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Milestone([
            'name' => $row[0],
            'period' => $row[1],
            'is_week' => $row[2],
        ]);
    }
}
