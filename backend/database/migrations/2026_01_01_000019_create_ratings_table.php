<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->uuid('booking_id')->unique();
            $table->uuid('barber_id');
            $table->uuid('customer_user_id')->nullable();
            $table->tinyInteger('stars');
            $table->text('comment')->nullable();
            $table->boolean('is_anonymous')->default(true);
            $table->timestamps();

            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->foreign('barber_id')->references('id')->on('barbers');
            $table->foreign('customer_user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
