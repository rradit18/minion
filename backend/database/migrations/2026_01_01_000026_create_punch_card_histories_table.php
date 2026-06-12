<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('punch_card_histories', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->uuid('customer_user_id');
            $table->uuid('booking_id')->nullable();
            $table->string('action');
            $table->integer('punch_count_after');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('customer_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('punch_card_histories');
    }
};
