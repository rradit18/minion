<?php

namespace Database\Seeders;

use App\Enums\ShiftStatus;
use App\Models\Barber;
use App\Models\BarberShift;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ShiftSeeder extends Seeder
{
    /**
     * Buat shift untuk setiap barber dari hari ini hingga 2 minggu ke depan.
     *
     * Aturan:
     * - 1 shift per barber per hari (satu cabang saja → bebas konflik lintas cabang).
     * - Bila barber di-assign ke >1 cabang, cabang dirotasi per hari.
     * - Jam shift mengikuti jam buka–tutup cabang, dengan istirahat 12:00–13:00.
     * - Idempoten via updateOrCreate (aman dijalankan ulang).
     */
    public function run(): void
    {
        $start = Carbon::today();
        $end   = Carbon::today()->addDays(13); // 14 hari (hari ini + 13)

        $barbers = Barber::with(['branchAssignments' => fn ($q) => $q->where('is_active', true)])
            ->where('is_active', true)
            ->get();

        $created = 0;

        foreach ($barbers as $barber) {
            $branchIds = $barber->branchAssignments
                ->pluck('branch_id')
                ->values();

            if ($branchIds->isEmpty()) {
                continue; // barber tanpa cabang → tidak bisa dijadwalkan
            }

            $branches = \App\Models\Branch::whereIn('id', $branchIds)
                ->get(['id', 'opening_time', 'closing_time'])
                ->keyBy('id');

            $dayIndex = 0;

            for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
                // Rotasi cabang per hari
                $branchId = $branchIds[$dayIndex % $branchIds->count()];
                $branch   = $branches[$branchId];

                BarberShift::updateOrCreate(
                    [
                        'barber_id'  => $barber->id,
                        'branch_id'  => $branchId,
                        'shift_date' => $date->toDateString(),
                    ],
                    [
                        'start_time'  => substr($branch->opening_time, 0, 5),
                        'end_time'    => substr($branch->closing_time, 0, 5),
                        'break_start' => '12:00',
                        'break_end'   => '13:00',
                        'status'      => ShiftStatus::Scheduled,
                    ]
                );

                $created++;
                $dayIndex++;
            }
        }

        $this->command->info("ShiftSeeder: {$created} shift dibuat untuk {$barbers->count()} barber (hari ini s/d {$end->toDateString()}).");
    }
}
