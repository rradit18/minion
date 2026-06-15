<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barbers', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Facades\DB::raw('gen_random_uuid()'));
            $table->uuid('user_id')->nullable()->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('photo_url')->nullable();
            $table->string('photo_public_id')->nullable();
            $table->text('bio')->nullable();
            $table->string('tagline')->nullable();
            $table->string('signature_color')->default('teal');
            $table->json('specializations')->nullable();
            $table->string('instagram')->nullable();
            $table->string('tiktok')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barbers');
    }
};
