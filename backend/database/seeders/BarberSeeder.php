<?php

namespace Database\Seeders;

use App\Enums\BarberSignatureColor;
use App\Enums\UserRole;
use App\Models\Barber;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BarberSeeder extends Seeder
{
    public function run(): void
    {
        $branches = Branch::all()->keyBy('slug');

        $barbers = [
            [
                'user' => [
                    'name'      => 'Rizky Pratama',
                    'phone'     => '08111000001',
                    'email'     => 'rizky@minionbarbershop.com',
                    'password'  => Hash::make('barber123'),
                    'role'      => UserRole::Barber,
                    'is_active' => true,
                ],
                'barber' => [
                    'name'            => 'Rizky Pratama',
                    'slug'            => 'rizky-pratama',
                    'bio'             => 'Spesialis skin fade dan desain rambut modern. Pengalaman 5 tahun di industri barbershop.',
                    'tagline'         => 'Presisi di setiap potongan.',
                    'signature_color' => BarberSignatureColor::Teal,
                    'specializations' => ['Skin Fade', 'Undercut', 'Pompadour'],
                    'instagram'       => '@rizky.cuts',
                    'is_active'       => true,
                ],
                'branches' => ['pramuka', 'batu-9'],
            ],
            [
                'user' => [
                    'name'      => 'Dani Saputra',
                    'phone'     => '08111000002',
                    'email'     => 'dani@minionbarbershop.com',
                    'password'  => Hash::make('barber123'),
                    'role'      => UserRole::Barber,
                    'is_active' => true,
                ],
                'barber' => [
                    'name'            => 'Dani Saputra',
                    'slug'            => 'dani-saputra',
                    'bio'             => 'Ahli dalam teknik klasik dan contemporary barbering. Senang menciptakan tampilan yang rapi dan berkarakter.',
                    'tagline'         => 'Gaya kamu, tangan aku.',
                    'signature_color' => BarberSignatureColor::Coral,
                    'specializations' => ['Classic Taper', 'Quiff', 'Beard Trim'],
                    'instagram'       => '@dani.barber',
                    'is_active'       => true,
                ],
                'branches' => ['pramuka'],
            ],
            [
                'user' => [
                    'name'      => 'Fauzan Hidayat',
                    'phone'     => '08111000003',
                    'email'     => 'fauzan@minionbarbershop.com',
                    'password'  => Hash::make('barber123'),
                    'role'      => UserRole::Barber,
                    'is_active' => true,
                ],
                'barber' => [
                    'name'            => 'Fauzan Hidayat',
                    'slug'            => 'fauzan-hidayat',
                    'bio'             => 'Barber muda berbakat dengan keahlian di tekstur rambut keriting dan natural. Lulusan terbaik pelatihan nasional 2023.',
                    'tagline'         => 'Natural vibes, clean finish.',
                    'signature_color' => BarberSignatureColor::Violet,
                    'specializations' => ['Curly Hair', 'Textured Crop', 'Line-up'],
                    'tiktok'          => '@fauzan.cuts',
                    'is_active'       => true,
                ],
                'branches' => ['batu-9'],
            ],
            [
                'user' => [
                    'name'      => 'Hendra Wijaya',
                    'phone'     => '08111000004',
                    'email'     => 'hendra@minionbarbershop.com',
                    'password'  => Hash::make('barber123'),
                    'role'      => UserRole::Barber,
                    'is_active' => true,
                ],
                'barber' => [
                    'name'            => 'Hendra Wijaya',
                    'slug'            => 'hendra-wijaya',
                    'bio'             => 'Senior barber dengan pengalaman 8 tahun. Spesialis penataan rambut tebal dan teknik mid fade.',
                    'tagline'         => 'Pengalaman berbicara lewat gunting.',
                    'signature_color' => BarberSignatureColor::Yellow,
                    'specializations' => ['Mid Fade', 'Thick Hair', 'Side Part'],
                    'instagram'       => '@hendra.barber',
                    'is_active'       => true,
                ],
                'branches' => ['batu-9', 'kijang-kota'],
            ],
            [
                'user' => [
                    'name'      => 'Bagas Nugroho',
                    'phone'     => '08111000005',
                    'email'     => 'bagas@minionbarbershop.com',
                    'password'  => Hash::make('barber123'),
                    'role'      => UserRole::Barber,
                    'is_active' => true,
                ],
                'barber' => [
                    'name'            => 'Bagas Nugroho',
                    'slug'            => 'bagas-nugroho',
                    'bio'             => 'Kreator tampilan modern untuk generasi muda. Aktif mengikuti tren barbering internasional.',
                    'tagline'         => 'Ikutin tren, tetap autentik.',
                    'signature_color' => BarberSignatureColor::Teal,
                    'specializations' => ['Drop Fade', 'French Crop', 'Design'],
                    'instagram'       => '@bagas.nugroho',
                    'tiktok'          => '@bagasbarber',
                    'is_active'       => true,
                ],
                'branches' => ['kijang-kota'],
            ],
            [
                'user' => [
                    'name'      => 'Aldi Firmansyah',
                    'phone'     => '08111000006',
                    'email'     => 'aldi@minionbarbershop.com',
                    'password'  => Hash::make('barber123'),
                    'role'      => UserRole::Barber,
                    'is_active' => true,
                ],
                'barber' => [
                    'name'            => 'Aldi Firmansyah',
                    'slug'            => 'aldi-firmansyah',
                    'bio'             => 'Barber presisi yang mengutamakan detail. Setiap potongan dikerjakan dengan tekad penuh.',
                    'tagline'         => 'Detail is everything.',
                    'signature_color' => BarberSignatureColor::Coral,
                    'specializations' => ['High Fade', 'Buzz Cut', 'Crew Cut'],
                    'instagram'       => '@aldi.firm',
                    'is_active'       => true,
                ],
                'branches' => ['kijang-kota', 'ganet'],
            ],
            [
                'user' => [
                    'name'      => 'Kevin Santoso',
                    'phone'     => '08111000007',
                    'email'     => 'kevin@minionbarbershop.com',
                    'password'  => Hash::make('barber123'),
                    'role'      => UserRole::Barber,
                    'is_active' => true,
                ],
                'barber' => [
                    'name'            => 'Kevin Santoso',
                    'slug'            => 'kevin-santoso',
                    'bio'             => 'Barber stylish di Jl. Ganet. Menggabungkan teknik modern dengan sentuhan lokal yang khas.',
                    'tagline'         => 'Style lokal, kelas internasional.',
                    'signature_color' => BarberSignatureColor::Violet,
                    'specializations' => ['Taper Fade', 'Slick Back', 'Mullet'],
                    'instagram'       => '@kevinsantoso.cuts',
                    'tiktok'          => '@kevin.barbershop',
                    'is_active'       => true,
                ],
                'branches' => ['ganet'],
            ],
            [
                'user' => [
                    'name'      => 'Reza Maulana',
                    'phone'     => '08111000008',
                    'email'     => 'reza@minionbarbershop.com',
                    'password'  => Hash::make('barber123'),
                    'role'      => UserRole::Barber,
                    'is_active' => true,
                ],
                'barber' => [
                    'name'            => 'Reza Maulana',
                    'slug'            => 'reza-maulana',
                    'bio'             => 'Spesialis rambut panjang dan styling pria. Cocok untuk kamu yang ingin tampil beda.',
                    'tagline'         => 'Beda itu berani.',
                    'signature_color' => BarberSignatureColor::Yellow,
                    'specializations' => ['Long Hair', 'Man Bun', 'Wolf Cut'],
                    'instagram'       => '@reza.maulana',
                    'is_active'       => true,
                ],
                'branches' => ['pramuka', 'ganet'],
            ],
        ];

        foreach ($barbers as $data) {
            $user = User::create($data['user']);

            $barberData = array_merge($data['barber'], ['user_id' => $user->id]);
            $barber = Barber::create($barberData);

            foreach ($data['branches'] as $slug) {
                if ($branch = $branches->get($slug)) {
                    $barber->branchAssignments()->create([
                        'branch_id' => $branch->id,
                        'is_active' => true,
                    ]);
                }
            }
        }
    }
}
