<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsDuplicatedToTemplateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('template_tasks', function (Blueprint $table) {
            $table->boolean('is_duplicated')->default(0);
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
            $table->dropColumn('is_duplicated');
        });
    }
}
