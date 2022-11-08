<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePivotTableTemplateTasks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pivot_table_template_tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('before_tasks');
            $table->unsignedBigInteger('after_tasks');
            $table->foreign('before_tasks')->references('id')->on('template_tasks')->onDelete('cascade');
            $table->foreign('after_tasks')->references('id')->on('template_tasks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pivot_table_template_tasks');
    }
}
