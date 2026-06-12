<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['phone' => '08117771001'],
            [
                'name'      => 'Admin Minion',
                'email'     => 'admin@minionbarbershop.com',
                'password'  => Hash::make('password'),
                'role'      => UserRole::Admin,
                'is_active' => true,
            ]
        );

        $branch = Branch::where('slug', 'pusat')->first();

        User::firstOrCreate(
            ['phone' => '08117771002'],
            [
                'name'      => 'Kasir Pusat',
                'email'     => 'kasir.pusat@minionbarbershop.com',
                'password'  => Hash::make('password'),
                'role'      => UserRole::Cashier,
                'is_active' => true,
                'branch_id' => $branch?->id,
            ]
        );

        User::firstOrCreate(
            ['phone' => '08117771003'],
            [
                'name'      => 'Customer Test',
                'email'     => 'customer@test.com',
                'password'  => Hash::make('password'),
                'role'      => UserRole::Customer,
                'is_active' => true,
            ]
        );
    }
}
