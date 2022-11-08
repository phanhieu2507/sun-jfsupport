<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddParentFieldToTemplateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('template_tasks', function (Blueprint $table) {
            $table->boolean('is_parent')->default(false);
            $table->boolean('has_parent')->default(false);
            $table->string('unit')->nullable()->change();
            $table->decimal('effort', 5, 1)->nullable()->change();
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
            $table->dropColumn(['is_parent', 'has_parent']);
            $table->string('unit')->change();
            $table->decimal('effort', 5, 1)->change();
        });
    }
}
