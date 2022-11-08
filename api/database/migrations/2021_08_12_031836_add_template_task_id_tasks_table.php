<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTemplateTaskIdTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->text('memo')->nullable();
            $table->unsignedBigInteger('template_task_id')->nullable();
            $table->foreign('template_task_id')->references('id')->on('template_tasks')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('memo');
            $table->dropForeign(['template_task_id']);
            $table->dropColumn('template_task_id');
        });
    }
}
