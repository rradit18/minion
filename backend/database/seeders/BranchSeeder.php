<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            [
                'name'            => 'Jl. Pramuka',
                'slug'            => 'pramuka',
                'address'         => 'Jl. Pramuka No.6, Tj. Ayun Sakti, Kec. Bukit Bestari, Kota Tanjung Pinang, Kepulauan Riau',
                'city'            => 'Tanjungpinang',
                'phone'           => '07713001001',
                'opening_time'    => '09:00:00',
                'closing_time'    => '23:00:00',
                'google_maps_url' => 'https://www.google.com/maps/place/Barbershop+Minion/@0.9010178,104.4600738,17z/data=!3m1!4b1!4m6!3m5!1s0x31d9729a2fd7f6c1:0xfd182ba5ef80f29a!8m2!3d0.9010124!4d104.4626487!16s%2Fg%2F11h4n0m5t3?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D', 
                'is_active'       => true,
            ],
            [
                'name'            => 'Kijang Kota',
                'slug'            => 'kijang-kota',
                'address'         => 'Jl. Kijang Raya No.45, Bintan',
                'city'            => 'Bintan',
                'phone'           => '07713001002',
                'opening_time'    => '09:00:00',
                'closing_time'    => '23:00:00',
                'google_maps_url' => 'https://www.google.com/maps/place/MINION+BARBERSHOP/@0.8506792,104.6055693,17z/data=!4m15!1m8!3m7!1s0x31d914e30ea79c63:0x6f3fcc8b56a09504!2sMINION+BARBERSHOP!8m2!3d0.8506738!4d104.6081442!10e1!16s%2Fg%2F11vrfb28md!3m5!1s0x31d914e30ea79c63:0x6f3fcc8b56a09504!8m2!3d0.8506738!4d104.6081442!16s%2Fg%2F11vrfb28md?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D',
                'is_active'       => true,
            ],
            [
                'name'            => 'Batu. 9',
                'slug'            => 'batu-9',
                'address'         => 'Jl. DI Panjaitan.Km. 9, Air Raja, Tanjungpinang,',
                'city'            => 'Tanjungpinang',
                'phone'           => '07713001003',
                'opening_time'    => '09:00:00',
                'closing_time'    => '23:00:00',
                'google_maps_url' => 'https://www.google.com/maps/place/Minion+Barbershop/@0.9169428,104.5066222,17z/data=!3m1!4b1!4m6!3m5!1s0x31d96d3366244d41:0x27815164e2a20aa!8m2!3d0.9169374!4d104.5091971!16s%2Fg%2F11xs8s5khf?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D',
                'is_active'       => true,
            ],
            [
                'name'            => 'Jl. Ganet',
                'slug'            => 'ganet',
                'address'         => 'Jl. Ganet No.22, Tanjungpinang',
                'city'            => 'Tanjungpinang',
                'phone'           => '07713001004',
                'opening_time'    => '09:00:00',
                'closing_time'    => '23:00:00',
                'google_maps_url' => "https://www.google.com/maps/place/0%C2%B055'48.3%22N+104%C2%B031'09.0%22E/@0.9301105,104.5182254,19.52z/data=!4m4!3m3!8m2!3d0.9300718!4d104.5191602!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D",
                'is_active'       => true,
            ],
        ];

        foreach ($branches as $branchData) {
            Branch::create($branchData);
        }
    }
}
