<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Branch;
use App\Models\Receipt;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class RevenueChartWidget extends ChartWidget
{
    protected ?string $heading = 'Revenue Harian';
    protected static ?int $sort = 2;

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

        $colors = ['#C9A544', '#60A5FA', '#34D399', '#F87171'];

        $datasets = $branches->map(function ($branch, $index) use ($receipts, $dates) {
            $branchRevenue = $receipts->where('branch_id', $branch->id);

            return [
                'label'           => $branch->name,
                'data'            => $dates->map(
                    fn($date) => (float) ($branchRevenue->firstWhere('date', $date)?->revenue ?? 0)
                )->values()->toArray(),
                'backgroundColor' => ['#C9A544', '#60A5FA', '#34D399', '#F87171'][$index % 4],
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
}
