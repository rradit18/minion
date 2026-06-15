<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branch_bank_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->uuid('branch_id');
            $table->string('bank_name');
            $table->string('account_number', 50);
            $table->string('account_holder');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_bank_accounts');
    }
};
