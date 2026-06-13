<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('payment_deadline_at')->nullable()->after('status');
            $table->string('payment_method')->nullable()->after('payment_deadline_at');
            $table->string('payment_proof_path')->nullable()->after('payment_method');
            $table->timestamp('proof_uploaded_at')->nullable()->after('payment_proof_path');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'payment_deadline_at',
                'payment_method',
                'payment_proof_path',
                'proof_uploaded_at',
            ]);
        });
    }
};
