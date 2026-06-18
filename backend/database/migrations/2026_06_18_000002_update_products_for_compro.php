<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Buat branch_id nullable agar produk bisa global (tidak terikat cabang)
            $table->dropForeign(['branch_id']);
            $table->uuid('branch_id')->nullable()->change();
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('set null');

            // Tambah kolom untuk tampilan compro
            $table->text('description')->nullable()->after('name');
            $table->boolean('best_seller')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['description', 'best_seller']);
            $table->dropForeign(['branch_id']);
            $table->uuid('branch_id')->nullable(false)->change();
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('cascade');
        });
    }
};
