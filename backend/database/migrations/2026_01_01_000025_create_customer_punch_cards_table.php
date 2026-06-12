<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_punch_cards', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->uuid('customer_user_id')->unique();
            $table->integer('punch_count')->default(0);
            $table->integer('lifetime_punch_count')->default(0);
            $table->timestamp('last_punched_at')->nullable();
            $table->timestamp('last_rewarded_at')->nullable();
            $table->timestamps();

            $table->foreign('customer_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_punch_cards');
    }
};
