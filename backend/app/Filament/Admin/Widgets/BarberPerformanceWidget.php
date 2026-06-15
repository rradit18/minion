<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Barber;
use App\Models\Booking;
use App\Models\Rating;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class BarberPerformanceWidget extends ChartWidget
{
    protected ?string $heading = 'Performa Barber Bulan Ini';
    protected static ?int $sort = 5;

    protected int|string|array $columnSpan = 'full';

    protected ?string $maxHeight = '320px';

    protected function getData(): array
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth   = now()->endOfMonth();

        $bookingCounts = Booking::whereBetween('scheduled_at', [$startOfMonth, $endOfMonth])
            ->whereNotIn('status', ['cancelled', 'expired'])
            ->select('barber_id', DB::raw('count(*) as total'))
            ->groupBy('barber_id')
            ->orderByDesc('total')
            ->limit(8)
            ->get();

        $barberIds = $bookingCounts->pluck('barber_id');
        $barbers   = Barber::whereIn('id', $barberIds)->get(['id', 'name'])->keyBy('id');

        $avgRatings = Rating::whereHas(
            'booking',
            fn($q) => $q->whereIn('barber_id', $barberIds)
                ->whereBetween('scheduled_at', [$startOfMonth, $endOfMonth])
        )
            ->join('bookings', 'ratings.booking_id', '=', 'bookings.id')
            ->select('bookings.barber_id', DB::raw('AVG(ratings.stars) as avg_stars'))
            ->groupBy('bookings.barber_id')
            ->get()
            ->keyBy('barber_id');

        $labels = $bookingCounts->map(fn($b) => $barbers[$b->barber_id]?->name ?? 'Unknown');
        $data   = $bookingCounts->pluck('total');
        $avgRatingData = $bookingCounts->map(fn($b) => round($avgRatings[$b->barber_id]?->avg_stars ?? 0, 1));

        return [
            'datasets' => [
                [
                    'label'           => 'Jumlah Booking',
                    'data'            => $data->values()->toArray(),
                    'backgroundColor' => '#C9A544',
                    'borderRadius'    => 6,
                    'borderSkipped'   => false,
                ],
                [
                    'label'           => 'Rata-rata Rating (×10)',
                    'data'            => $avgRatingData->map(fn($v) => $v * 10)->values()->toArray(),
                    'backgroundColor' => '#60A5FA',
                    'borderRadius'    => 6,
                    'borderSkipped'   => false,
                ],
            ],
            'labels' => $labels->values()->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'indexAxis'  => 'y',
            'animation'  => ['duration' => 1100, 'easing' => 'easeInOutQuart'],
            'plugins'    => [
                'legend' => ['position' => 'top', 'labels' => ['usePointStyle' => true, 'boxWidth' => 8]],
            ],
            'scales' => [
                'x' => ['beginAtZero' => true, 'grid' => ['color' => 'rgba(148,163,184,0.12)']],
                'y' => ['grid' => ['display' => false]],
            ],
        ];
    }
}
