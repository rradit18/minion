<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->uuid('branch_id')->nullable();
            $table->uuid('user_id')->nullable();
            $table->tinyInteger('stars');
            $table->string('category');
            $table->text('message')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_phone', 20)->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('set null');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
