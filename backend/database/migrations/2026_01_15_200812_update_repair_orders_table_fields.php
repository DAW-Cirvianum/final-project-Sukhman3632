<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('repair_orders', function (Blueprint $table) {
            $table->dropColumn(['km', 'total_cost']);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('final_cost', 10, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('repair_orders', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date', 'final_cost']);
            $table->integer('km');
            $table->decimal('total_cost', 10, 2)->default(0);
        });
    }
};
