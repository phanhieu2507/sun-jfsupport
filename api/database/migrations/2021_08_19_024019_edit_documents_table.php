<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->string('name');
            $table->string('link')->nullable();
            $table->string('path')->default('/');
            $table->boolean('is_file');
            $table->dropColumn('author');
            $table->dropColumn('update_date');
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->unsignedBigInteger('authorId');
            $table->unsignedBigInteger('updaterId');
            $table->dropColumn('description');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('link');
            $table->dropColumn('path');
            $table->dropColumn('is_file');
            $table->string('author');
            $table->dateTime('update_date');
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
            $table->dropColumn('authorId');
            $table->dropColumn('updaterId');
            $table->text('description');
        });
    }
}
