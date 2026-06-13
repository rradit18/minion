<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Branch;
use App\Models\Receipt;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class RevenueChartWidget extends ChartWidget
{
    protected ?string $heading = 'Revenue Harian per Cabang';
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected ?string $maxHeight = '280px';

    public ?string $filter = '30d';

    protected function getFilters(): ?array
    {
        return [
            '7d'  => '7 Hari Terakhir',
            '30d' => '30 Hari Terakhir',
            '90d' => '90 Hari Terakhir',
        ];
    }

    protected function getData(): array
    {
        $days = match ($this->filter) {
            '7d'  => 7,
            '90d' => 90,
            default => 30,
        };

        $startDate = now()->subDays($days - 1)->startOfDay();

        $receipts = Receipt::whereBetween('created_at', [$startDate, now()])
            ->select(
                DB::raw("DATE(created_at) as date"),
                'branch_id',
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('date', 'branch_id')
            ->get();

        $branches = Branch::where('is_active', true)->get(['id', 'name']);

        $dates = collect(range(0, $days - 1))
            ->map(fn($i) => now()->subDays($days - 1 - $i)->toDateString());

        $colors = ['#C9A544', '#60A5FA', '#34D399', '#F472B6', '#A78BFA', '#FBBF24'];

        $datasets = $branches->map(function ($branch, $index) use ($receipts, $dates, $colors) {
            $branchRevenue = $receipts->where('branch_id', $branch->id);
            $color = $colors[$index % count($colors)];

            return [
                'label'           => $branch->name,
                'data'            => $dates->map(
                    fn($date) => (float) ($branchRevenue->firstWhere('date', $date)?->revenue ?? 0)
                )->values()->toArray(),
                'backgroundColor' => $color,
                'borderColor'     => $color,
                'borderRadius'    => 6,
                'borderSkipped'   => false,
                'maxBarThickness' => 26,
            ];
        })->values()->toArray();

        return [
            'datasets' => $datasets,
            'labels'   => $dates->map(fn($d) => date('d M', strtotime($d)))->values()->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'animation' => ['duration' => 1100, 'easing' => 'easeInOutQuart'],
            'plugins'   => [
                'legend' => ['position' => 'top', 'labels' => ['usePointStyle' => true, 'boxWidth' => 8]],
            ],
            'scales' => [
                'x' => ['grid' => ['display' => false], 'ticks' => ['maxRotation' => 0, 'autoSkip' => true]],
                'y' => [
                    'beginAtZero' => true,
                    'grid'        => ['color' => 'rgba(148,163,184,0.12)'],
                    'ticks'       => ['callback' => null],
                ],
            ],
            'interaction' => ['intersect' => false, 'mode' => 'index'],
        ];
    }
}
