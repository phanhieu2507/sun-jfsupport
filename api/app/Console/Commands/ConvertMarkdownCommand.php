<?php

namespace App\Console\Commands;

use App\Models\Comment;
use App\Models\Task;
use App\Models\TemplateTask;
use Illuminate\Console\Command;

class ConvertMarkdownCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'convert-markdown';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Convert description template_tasks and tasks ';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        TemplateTask::whereNotNull('id')->get()->each(function ($tt) {
            $tt->update(['description_of_detail' => convertMarkdown($tt->description_of_detail)]);
        });
        Task::whereNotNull('id')->get()->each(function ($tt) {
            $tt->update(['description_of_detail' => convertMarkdown($tt->description_of_detail)]);
        });
        Comment::whereNotNull('id')->get()->each(function ($comment) {
            $comment->update([
                'old_description' => convertMarkdown($comment->old_description),
                'new_description' => convertMarkdown($comment->new_description),
            ]);
        });
    }
}
