<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barber_branch_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->uuid('barber_id');
            $table->uuid('branch_id');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['barber_id', 'branch_id']);
            $table->foreign('barber_id')->references('id')->on('barbers')->onDelete('cascade');
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barber_branch_assignments');
    }
};
