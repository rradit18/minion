<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\BranchServicePrice;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['name' => 'Potong Rambut',          'duration_minutes' => 30,  'default_price' => 35000, 'sort_order' => 1],
            ['name' => 'Potong Rambut + Cuci',   'duration_minutes' => 45,  'default_price' => 45000, 'sort_order' => 2],
            ['name' => 'Cukur Jenggot',           'duration_minutes' => 20,  'default_price' => 25000, 'sort_order' => 3],
            ['name' => 'Creambath',               'duration_minutes' => 60,  'default_price' => 75000, 'sort_order' => 4],
            ['name' => 'Hair Coloring',           'duration_minutes' => 90,  'default_price' => 150000,'sort_order' => 5],
            ['name' => 'Hair Treatment',          'duration_minutes' => 60,  'default_price' => 100000,'sort_order' => 6],
            ['name' => 'Potong Anak (< 10 thn)', 'duration_minutes' => 30,  'default_price' => 30000, 'sort_order' => 7],
        ];

        $branches = Branch::all();

        foreach ($services as $serviceData) {
            $service = Service::create(array_merge($serviceData, ['is_active' => true]));

            foreach ($branches as $branch) {
                BranchServicePrice::create([
                    'branch_id'  => $branch->id,
                    'service_id' => $service->id,
                    'price'      => $service->default_price,
                    'is_active'  => true,
                ]);
            }
        }
    }
}
