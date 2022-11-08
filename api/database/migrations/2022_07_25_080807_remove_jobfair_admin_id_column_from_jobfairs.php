<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveJobfairAdminIdColumnFromJobfairs extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('jobfairs', function (Blueprint $table) {
            $table->dropForeign(['jobfair_admin_id']);
            $table->dropColumn('jobfair_admin_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('jobfairs', function (Blueprint $table) {
            $table->unsignedBigInteger('jobfair_admin_id');
            $table->foreign('jobfair_admin_id')->references('id')->on('users');
        });
    }
}
