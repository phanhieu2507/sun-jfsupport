<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeColumnToTemplateTasks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('template_tasks', function (Blueprint $table) {
            $table->dropColumn(['relation_task_id', 'number_of_member', 'status', 'remind_remember']);
            $table->boolean('is_day');
            $table->string('unit');
            $table->decimal('effort', 5, 1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('template_tasks', function (Blueprint $table) {
            $table->string('relation_task_id');
            $table->unsignedInteger('number_of_member');
            $table->unsignedSmallInteger('status');
            $table->boolean('remind_remember');
            $table->dropColumn(['is_day', 'unit', 'effort']);
        });
    }
}
