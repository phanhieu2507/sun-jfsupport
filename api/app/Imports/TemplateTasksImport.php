<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\Milestone;
use App\Models\TemplateTask;
use Maatwebsite\Excel\Concerns\ToModel;

class TemplateTasksImport implements ToModel
{
    private $milestones;

    private $categories;

    public function __construct()
    {
        $this->milestones = Milestone::select('id', 'name')->get();
        $this->categories = Category::select('id', 'category_name')->get();
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        if ($row[7] === '企業数') {
            $unit = 'companies';
        } else if ($row[7] === '学生数') {
            $unit = 'students';
        } else {
            $unit = 'none';
        }

        $milestone = $this->milestones->where('name', trim($row[1]))->first();
        $arr = explode(',', $row[2]);
        $category = $this->categories->whereIn('category_name', $arr)->pluck('id');
        $row[4] = "<br />\n".$row[4];
        $descriptionOfDetail = preg_replace('/\n/', '<br /> ', $row[3]).'<br /> '.preg_replace('/\n・/', "\n".'- [ ] ', $row[4]);
        //$description = substr($description, 0, strlen($row[3]) + 1).substr($description, strlen($row[3]) + 9);
        $newTemplateTask = TemplateTask::create([
            'name'                  => trim($row[0]),
            'description_of_detail' => convertMarkdown($descriptionOfDetail),
            'milestone_id'          => $milestone->id ?? null,
            'is_day'                => $row[6] === '時間' ? 0 : 1,
            'unit'                  => $unit,
            'effort'                => $row[5],
        ]);
        $newTemplateTask->categories()->attach($category);

        return $newTemplateTask;
    }
}
