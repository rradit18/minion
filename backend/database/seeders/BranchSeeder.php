<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\BranchBankAccount;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            [
                'name'         => 'Minion Barbershop Pusat',
                'slug'         => 'pusat',
                'address'      => 'Jl. Teuku Umar No. 10, Tanjungpinang Kota',
                'city'         => 'Tanjungpinang',
                'phone'        => '07713001001',
                'opening_time' => '08:00:00',
                'closing_time' => '21:00:00',
                'is_active'    => true,
            ],
            [
                'name'         => 'Minion Barbershop Batu 8',
                'slug'         => 'batu-8',
                'address'      => 'Jl. Raja Ali Haji KM 8, Tanjungpinang Timur',
                'city'         => 'Tanjungpinang',
                'phone'        => '07713001002',
                'opening_time' => '09:00:00',
                'closing_time' => '21:00:00',
                'is_active'    => true,
            ],
            [
                'name'         => 'Minion Barbershop Batu 12',
                'slug'         => 'batu-12',
                'address'      => 'Jl. Raja Ali Haji KM 12, Tanjungpinang Timur',
                'city'         => 'Tanjungpinang',
                'phone'        => '07713001003',
                'opening_time' => '09:00:00',
                'closing_time' => '21:00:00',
                'is_active'    => true,
            ],
            [
                'name'         => 'Minion Barbershop Bintan Center',
                'slug'         => 'bintan-center',
                'address'      => 'Mall Bintan Center Lt. 1, Tanjungpinang Barat',
                'city'         => 'Tanjungpinang',
                'phone'        => '07713001004',
                'opening_time' => '10:00:00',
                'closing_time' => '22:00:00',
                'is_active'    => true,
            ],
        ];

        foreach ($branches as $branchData) {
            $branch = Branch::create($branchData);

            BranchBankAccount::create([
                'branch_id'      => $branch->id,
                'bank_name'      => 'BCA',
                'account_number' => '1234567890',
                'account_holder' => 'Minion Barbershop',
                'is_active'      => true,
                'sort_order'     => 1,
            ]);
        }
    }
}
