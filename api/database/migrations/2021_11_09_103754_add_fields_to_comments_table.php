<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->string('old_previous_tasks', 500)->nullable();
            $table->string('new_previous_tasks', 500)->nullable();
            $table->string('old_following_tasks', 500)->nullable();
            $table->string('new_following_tasks', 500)->nullable();
            $table->string('old_name')->nullable();
            $table->string('new_name')->nullable();
            $table->string('old_reviewers', 500)->nullable();
            $table->string('new_reviewers', 500)->nullable();
            $table->date('old_start_date')->nullable();
            $table->date('new_start_date')->nullable();
            $table->date('old_end_date')->nullable();
            $table->date('new_end_date')->nullable();
            $table->boolean('is_created_task')->default(false);
            $table->boolean('is_normal_comment')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn([
                'old_previous_tasks',
                'new_previous_tasks',
                'old_following_tasks',
                'new_following_tasks',
                'old_name',
                'new_name',
                'old_reviewers',
                'new_reviewers',
                'old_start_date',
                'new_start_date',
                'old_end_date',
                'new_end_date',
                'is_created_task',
                'is_normal_comment',
            ]);
        });
    }
}
