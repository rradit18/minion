<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Booking;
use App\Models\Branch;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class BookingTrendWidget extends ChartWidget
{
    protected ?string $heading = 'Tren Booking Harian';
    protected static ?int $sort = 3;

    public ?string $filter = 'all';

    protected function getFilters(): ?array
    {
        $options = ['all' => 'Semua Cabang'];
        Branch::where('is_active', true)->get(['id', 'name'])
            ->each(fn($b) => $options[$b->id] = $b->name);

        return $options;
    }

    protected function getData(): array
    {
        $days      = 30;
        $startDate = now()->subDays($days - 1)->startOfDay();

        $query = Booking::whereBetween('created_at', [$startDate, now()])
            ->select(DB::raw("DATE(created_at) as date"), DB::raw('count(*) as total'))
            ->groupBy('date');

        if ($this->filter !== 'all') {
            $query->where('branch_id', $this->filter);
        }

        $bookings = $query->get()->keyBy('date');

        $dates = collect(range(0, $days - 1))
            ->map(fn($i) => now()->subDays($days - 1 - $i)->toDateString());

        return [
            'datasets' => [
                [
                    'label'           => 'Jumlah Booking',
                    'data'            => $dates->map(fn($d) => (int) ($bookings[$d]->total ?? 0))->values()->toArray(),
                    'borderColor'     => '#C9A544',
                    'backgroundColor' => 'rgba(201, 165, 68, 0.1)',
                    'fill'            => true,
                ],
            ],
            'labels' => $dates->map(fn($d) => date('d M', strtotime($d)))->values()->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
