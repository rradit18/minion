<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->string('booking_number', 20)->unique();
            $table->uuid('branch_id');
            $table->uuid('barber_id');
            $table->uuid('customer_user_id')->nullable();
            $table->string('customer_name');
            $table->string('customer_phone', 20);
            $table->text('notes')->nullable();
            $table->timestamp('scheduled_at');
            $table->integer('total_duration_minutes')->default(0);
            $table->decimal('total_price', 12, 2)->default(0);
            $table->string('status')->default('pending_confirmation');
            $table->string('type')->default('online');
            $table->integer('reschedule_count')->default(0);
            $table->timestamp('original_scheduled_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancelled_by')->nullable();
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches');
            $table->foreign('barber_id')->references('id')->on('barbers');
            $table->foreign('customer_user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
