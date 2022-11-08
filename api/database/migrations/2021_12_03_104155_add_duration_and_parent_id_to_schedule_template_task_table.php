<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDurationAndParentIdToScheduleTemplateTaskTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('schedule_template_task', function (Blueprint $table) {
            $table->unsignedBigInteger('template_task_parent_id')->nullable();
            $table->unsignedInteger('duration')->nullable();
            $table->foreign('template_task_parent_id')->references('id')
                ->on('template_tasks')->nullOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('schedule_template_task', function (Blueprint $table) {
            $table->dropForeign('schedule_template_task_template_task_parent_id_foreign');
            $table->dropColumn(['template_task_parent_id', 'duration']);
        });
    }
}
