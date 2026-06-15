<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Booking;
use App\Models\Receipt;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $today     = today();
        $yesterday = today()->subDay();

        $revenueToday     = Receipt::whereDate('created_at', $today)->sum('total');
        $revenueYesterday = Receipt::whereDate('created_at', $yesterday)->sum('total');
        $revenueChange    = $revenueYesterday > 0
            ? (($revenueToday - $revenueYesterday) / $revenueYesterday) * 100
            : ($revenueToday > 0 ? 100 : 0);

        $bookingsWeek = Booking::whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ])->count();

        $completedCount = Booking::whereDate('created_at', $today)
            ->where('status', 'completed')
            ->count();
        $totalNonCancelled = Booking::whereDate('created_at', $today)
            ->whereNotIn('status', ['cancelled', 'expired'])
            ->count();
        $completionRate = $totalNonCancelled > 0
            ? round(($completedCount / $totalNonCancelled) * 100)
            : 0;

        $topBarber = Booking::whereDate('scheduled_at', $today)
            ->whereNotIn('status', ['cancelled', 'expired'])
            ->select('barber_id', DB::raw('count(*) as count'))
            ->groupBy('barber_id')
            ->orderByDesc('count')
            ->with('barber:id,name')
            ->first();

        $topBarberName = $topBarber?->barber?->name ?? '-';

        return [
            Stat::make('Revenue Hari Ini', 'Rp ' . number_format($revenueToday, 0, ',', '.'))
                ->description(sprintf('%+.1f%% dari kemarin', $revenueChange))
                ->descriptionIcon($revenueChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueChange >= 0 ? 'success' : 'danger'),

            Stat::make('Booking Minggu Ini', number_format($bookingsWeek))
                ->description('Total booking 7 hari ini')
                ->color('info'),

            Stat::make('Completion Rate', "{$completionRate}%")
                ->description("Selesai hari ini: {$completedCount}")
                ->color($completionRate >= 80 ? 'success' : ($completionRate >= 50 ? 'warning' : 'danger')),

            Stat::make('Barber Terpopuler', $topBarberName)
                ->description('Booking terbanyak hari ini')
                ->color('warning'),
        ];
    }
}
