<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCollumnsToCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->text('old_description')->nullable();
            $table->text('new_description')->nullable();
            $table->string('old_assignees', 500)->nullable();
            $table->string('new_assignees', 500)->nullable();
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
                'old_description',
                'new_description',
                'old_assignees',
                'new_assignees',
            ]);
        });
    }
}
