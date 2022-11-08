<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropTemplateMilestonesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('template_tasks', function (Blueprint $table) {
            $table->dropForeign('template_tasks_milestone_id_foreign');
            $table->foreign('milestone_id')->references('id')->on('milestones')->onDelete('cascade');
        });
        Schema::dropIfExists('template_milestones');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('template_milestones', function (Blueprint $table) {
            $table->id();
            $table->string('milestone_name')->unique();
            $table->date('period');
            $table->boolean('is_week');
        });
    }
}
