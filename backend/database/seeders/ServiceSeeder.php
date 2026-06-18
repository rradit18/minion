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
        // default_price = harga dasar; harga per cabang bervariasi ±10–20%
        $services = [
            [
                'name'             => 'Kids Cut',
                'description'      => 'Hair Cut + Hair Wash + Cold Towel + Styling + Pomade',
                'duration_minutes' => 45,
                'default_price'    => 45000,
                'sort_order'       => 1,
                'branch_prices'    => [
                    'pramuka'     => 45000,
                    'kijang-kota' => 50000,
                    'batu-9'      => 45000,
                    'ganet'       => 40000,
                ],
            ],
            [
                'name'             => 'Standard Cut',
                'description'      => 'Hair Cut + Hair Wash + Shoulder Massage + Styling',
                'duration_minutes' => 60,
                'default_price'    => 65000,
                'sort_order'       => 2,
                'branch_prices'    => [
                    'pramuka'     => 65000,
                    'kijang-kota' => 70000,
                    'batu-9'      => 65000,
                    'ganet'       => 60000,
                ],
            ],
            [
                'name'             => 'Medium Cut',
                'description'      => 'Hair Cut + Hair Wash + Creambat + Scrub + Hot Towel + Cold Towel + Tonic + Styling',
                'duration_minutes' => 90,
                'default_price'    => 95000,
                'sort_order'       => 3,
                'branch_prices'    => [
                    'pramuka'     => 95000,
                    'kijang-kota' => 105000,
                    'batu-9'      => 95000,
                    'ganet'       => 90000,
                ],
            ],
            [
                'name'             => 'Premium Cut',
                'description'      => 'Hair Cut + Hair Wash + Facial + Hot Towel + Cold Towel + Eyegell + Tonic + Styling',
                'duration_minutes' => 120,
                'default_price'    => 135000,
                'sort_order'       => 4,
                'branch_prices'    => [
                    'pramuka'     => 135000,
                    'kijang-kota' => 150000,
                    'batu-9'      => 135000,
                    'ganet'       => 125000,
                ],
            ],
            [
                'name'             => 'Exc Cut',
                'description'      => 'Hair Cut + Hair Wash + Creambat + Black Masker + Facial Steamer + Treatment + Styling',
                'duration_minutes' => 150,
                'default_price'    => 175000,
                'sort_order'       => 5,
                'branch_prices'    => [
                    'pramuka'     => 175000,
                    'kijang-kota' => 195000,
                    'batu-9'      => 175000,
                    'ganet'       => 160000,
                ],
            ],
        ];

        $branches = Branch::all()->keyBy('slug');

        foreach ($services as $serviceData) {
            $branchPrices = $serviceData['branch_prices'];
            unset($serviceData['branch_prices']);

            $service = Service::create(array_merge($serviceData, ['is_active' => true]));

            foreach ($branches as $slug => $branch) {
                BranchServicePrice::create([
                    'branch_id'  => $branch->id,
                    'service_id' => $service->id,
                    'price'      => $branchPrices[$slug] ?? $service->default_price,
                    'is_active'  => true,
                ]);
            }
        }
    }
}
