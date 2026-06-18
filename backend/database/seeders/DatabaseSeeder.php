<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Hanya seed akun akses (admin, kasir, customer).
        // Data konten (cabang, layanan, barber, shift) diisi lewat Filament admin.
        $this->call([
            AdminUserSeeder::class,
        ]);

        // Seeder data demo dinonaktifkan — aktifkan kembali bila butuh data contoh:
        // BranchSeeder::class,
        // ServiceSeeder::class,
        // BarberSeeder::class,
        // ShiftSeeder::class,
    }
}
