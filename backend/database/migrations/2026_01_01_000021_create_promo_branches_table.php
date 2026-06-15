<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_branches', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->uuid('promo_id');
            $table->uuid('branch_id');
            $table->timestamps();

            $table->unique(['promo_id', 'branch_id']);
            $table->foreign('promo_id')->references('id')->on('promos')->onDelete('cascade');
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_branches');
    }
};
