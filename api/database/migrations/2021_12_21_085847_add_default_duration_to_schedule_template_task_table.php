<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddDefaultDurationToScheduleTemplateTaskTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('schedule_template_task', function (Blueprint $table) {
            $table->unsignedInteger('duration')->change();
            $table->unsignedInteger('duration')->default(1)->change();
        });
        DB::table('schedule_template_task')->update(['duration' => 1]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('schedule_template_task', function (Blueprint $table) {
            $table->unsignedInteger('duration')->nullable()->change();
        });
    }
}
