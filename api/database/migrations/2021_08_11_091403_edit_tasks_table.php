<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->boolean('remind_member')->nullable()->change();
            $table->text('description_of_detail')->nullable()->change();
            $table->unsignedBigInteger('schedule_id');
            $table->foreign('schedule_id')->references('id')->on('schedules')->onDelete('cascade');
            $table->dropColumn('number_of_member');
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
            $table->boolean('remind_member')->change();
            $table->text('description_of_detail')->change();
            $table->dropForeign(['schedule_id']);
            $table->dropColumn('schedule_id');
            $table->unsignedInteger('number_of_member');
        });
    }
}
