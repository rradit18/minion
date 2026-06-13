<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Receipt;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class PaymentMethodChartWidget extends ChartWidget
{
    protected ?string $heading = 'Metode Pembayaran (Bulan Ini)';
    protected static ?int $sort = 4;

    protected ?string $maxHeight = '260px';

    protected function getData(): array
    {
        $rows = Receipt::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->select('payment_method', DB::raw('SUM(total) as total'))
            ->groupBy('payment_method')
            ->get();

        $labels = [
            'cash'          => 'Cash',
            'bank_transfer' => 'Transfer Bank',
            'qris_external' => 'QRIS',
        ];
        $colors = [
            'cash'          => '#34D399',
            'bank_transfer' => '#60A5FA',
            'qris_external' => '#C9A544',
        ];

        return [
            'datasets' => [
                [
                    'label'           => 'Revenue',
                    'data'            => $rows->map(fn($r) => (float) $r->total)->values()->toArray(),
                    'backgroundColor' => $rows->map(fn($r) => $colors[$r->payment_method->value ?? $r->payment_method] ?? '#9CA3AF')->values()->toArray(),
                    'borderWidth'     => 0,
                    'hoverOffset'     => 8,
                ],
            ],
            'labels' => $rows->map(fn($r) => $labels[$r->payment_method->value ?? $r->payment_method] ?? ($r->payment_method->value ?? $r->payment_method))->values()->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getOptions(): array
    {
        return [
            'animation' => ['animateRotate' => true, 'animateScale' => true, 'duration' => 1100],
            'cutout'    => '62%',
            'plugins'   => [
                'legend' => ['position' => 'right', 'labels' => ['usePointStyle' => true, 'boxWidth' => 10]],
            ],
        ];
    }
}
