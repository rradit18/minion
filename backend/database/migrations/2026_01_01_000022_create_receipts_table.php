<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->string('receipt_number', 20)->unique();
            $table->uuid('booking_id')->nullable()->unique();
            $table->uuid('kasir_id')->nullable();
            $table->uuid('branch_id');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('promo_discount', 12, 2)->default(0);
            $table->decimal('tip_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->string('payment_method');
            $table->decimal('amount_paid', 12, 2)->nullable();
            $table->decimal('change_amount', 12, 2)->nullable();
            $table->timestamps();

            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('set null');
            $table->foreign('kasir_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('branch_id')->references('id')->on('branches');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
