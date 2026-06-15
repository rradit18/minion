<?php

namespace App\Filament\Admin\Pages;

use App\Models\Branch;
use App\Models\Receipt;
use Filament\Pages\Page;
use Illuminate\Database\Eloquent\Builder;
use OpenSpout\Common\Entity\Cell;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Style\CellAlignment;
use OpenSpout\Common\Entity\Style\Color;
use OpenSpout\Common\Entity\Style\Style;
use OpenSpout\Writer\XLSX\Options;
use OpenSpout\Writer\XLSX\Writer;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FinancialReport extends Page
{
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-banknotes';

    protected static ?string $navigationLabel = 'Laporan Keuangan';

    protected static ?string $title = 'Laporan Keuangan';

    protected static ?int $navigationSort = 9;

    protected string $view = 'filament.admin.pages.financial-report';

    public ?string $branchId = null;   // null = semua cabang
    public string  $from     = '';
    public string  $until    = '';

    public function mount(): void
    {
        $this->from  = today()->startOfMonth()->toDateString();
        $this->until = today()->toDateString();
    }

    protected function baseQuery(): Builder
    {
        return Receipt::query()
            ->when($this->branchId, fn(Builder $q) => $q->where('branch_id', $this->branchId))
            ->when($this->from, fn(Builder $q) => $q->whereDate('created_at', '>=', $this->from))
            ->when($this->until, fn(Builder $q) => $q->whereDate('created_at', '<=', $this->until));
    }

    /** Ringkasan terhitung ulang setiap filter berubah. */
    protected function buildReport(): array
    {
        $receipts = $this->baseQuery()->get(['branch_id', 'booking_id', 'payment_method', 'total', 'tip_amount']);

        $branchNames = Branch::pluck('name', 'id');

        $paymentLabels = [
            'cash'          => 'Cash',
            'bank_transfer' => 'Transfer Bank',
            'qris_external' => 'QRIS',
        ];

        $byPayment = $receipts->groupBy(fn($r) => $r->payment_method->value ?? $r->payment_method)
            ->map(fn($group, $method) => [
                'label' => $paymentLabels[$method] ?? $method,
                'count' => $group->count(),
                'total' => (float) $group->sum('total'),
            ])
            ->values()
            ->all();

        $byBranch = $receipts->groupBy('branch_id')
            ->map(fn($group, $branchId) => [
                'branch' => $branchNames[$branchId] ?? '-',
                'count'  => $group->count(),
                'total'  => (float) $group->sum('total'),
            ])
            ->sortByDesc('total')
            ->values()
            ->all();

        $service = $receipts->whereNotNull('booking_id');
        $product = $receipts->whereNull('booking_id');

        $count = $receipts->count();
        $total = (float) $receipts->sum('total');

        return [
            'total'         => $total,
            'count'         => $count,
            'avg'           => $count > 0 ? $total / $count : 0.0,
            'tip'           => (float) $receipts->sum('tip_amount'),
            'service_total' => (float) $service->sum('total'),
            'service_count' => $service->count(),
            'product_total' => (float) $product->sum('total'),
            'product_count' => $product->count(),
            'by_payment'    => $byPayment,
            'by_branch'     => $byBranch,
        ];
    }

    public function export(): StreamedResponse
    {
        $branchLabel = $this->branchId
            ? (Branch::find($this->branchId)?->name ?? 'Cabang')
            : 'Semua Cabang';

        $filename = 'laporan-keuangan_' . \Illuminate\Support\Str::slug($branchLabel)
            . "_{$this->from}_sd_{$this->until}.xlsx";

        $branchNames   = Branch::pluck('name', 'id');
        $paymentLabels = [
            'cash'          => 'Cash',
            'bank_transfer' => 'Transfer Bank',
            'qris_external' => 'QRIS',
        ];

        $receipts = $this->baseQuery()
            ->with(['kasir:id,name', 'booking:id,customer_name'])
            ->orderBy('created_at')
            ->get();

        $report  = $this->buildReport();
        $periode = \Illuminate\Support\Carbon::parse($this->from)->isoFormat('D MMM Y')
            . ' – ' . \Illuminate\Support\Carbon::parse($this->until)->isoFormat('D MMM Y');

        // ── Palet & gaya ──
        $gold     = Color::rgb(201, 165, 68);   // #C9A544 (brand)
        $dark     = Color::rgb(31, 41, 55);     // gray-800
        $light    = Color::rgb(243, 244, 246);  // gray-100
        $totalBg  = Color::rgb(254, 243, 199);  // amber-100
        $money    = '"Rp" #,##0';

        $titleStyle = (new Style())->setFontBold()->setFontSize(18)->setFontColor($dark);
        $metaStyle  = (new Style())->setFontSize(11)->setFontColor(Color::rgb(107, 114, 128));

        $cardTitleStyle = (new Style())->setFontBold()->setFontSize(10)->setFontColor(Color::WHITE)
            ->setBackgroundColor($dark)->setCellAlignment(CellAlignment::CENTER);
        $cardMoneyStyle = (new Style())->setFontBold()->setFontSize(13)->setBackgroundColor($light)
            ->setCellAlignment(CellAlignment::CENTER)->setFormat($money);
        $cardIntStyle   = (new Style())->setFontBold()->setFontSize(13)->setBackgroundColor($light)
            ->setCellAlignment(CellAlignment::CENTER)->setFormat('#,##0');

        $headerStyle = (new Style())->setFontBold()->setFontColor(Color::WHITE)
            ->setBackgroundColor($gold)->setCellAlignment(CellAlignment::CENTER);
        $moneyStyle  = (new Style())->setFormat($money);
        $totalLabel  = (new Style())->setFontBold()->setBackgroundColor($totalBg);
        $totalMoney  = (new Style())->setFontBold()->setBackgroundColor($totalBg)->setFormat($money);

        $options = new Options();
        $options->setColumnWidth(20, 1);
        $options->setColumnWidth(16, 2);
        $options->setColumnWidth(24, 3);
        $options->setColumnWidth(10, 4);
        $options->setColumnWidth(18, 5);
        $options->setColumnWidth(15, 6);
        $options->setColumnWidth(16, 7);
        $options->setColumnWidth(13, 8, 9, 10, 11);

        return response()->streamDownload(function () use (
            $receipts, $branchNames, $paymentLabels, $report, $branchLabel, $periode, $options,
            $titleStyle, $metaStyle, $cardTitleStyle, $cardMoneyStyle, $cardIntStyle,
            $headerStyle, $moneyStyle, $totalLabel, $totalMoney
        ) {
            $writer = new Writer($options);
            $writer->openToFile('php://output');
            $writer->getCurrentSheet()->setName('Laporan');

            $blank = fn() => $writer->addRow(Row::fromValues(['']));

            // ── Judul + meta ──
            $writer->addRow(Row::fromValues(['LAPORAN KEUANGAN'], $titleStyle));
            $writer->addRow(Row::fromValues(['Cabang: ' . $branchLabel], $metaStyle));
            $writer->addRow(Row::fromValues(['Periode: ' . $periode], $metaStyle));
            $blank();

            // ── Score cards ──
            $writer->addRow(new Row([
                Cell::fromValue('Total Pendapatan', $cardTitleStyle),
                Cell::fromValue('Jumlah Transaksi', $cardTitleStyle),
                Cell::fromValue('Rata-rata / Transaksi', $cardTitleStyle),
                Cell::fromValue('Total Tip Barber', $cardTitleStyle),
            ]));
            $writer->addRow(new Row([
                Cell::fromValue($report['total'], $cardMoneyStyle),
                Cell::fromValue($report['count'], $cardIntStyle),
                Cell::fromValue($report['avg'],   $cardMoneyStyle),
                Cell::fromValue($report['tip'],   $cardMoneyStyle),
            ]));
            $blank();

            // ── Tabel detail ──
            $writer->addRow(Row::fromValues([
                'No. Struk', 'Tanggal', 'Cabang', 'Jenis', 'Pelanggan',
                'Metode', 'Kasir', 'Subtotal', 'Diskon', 'Tip', 'Total',
            ], $headerStyle));

            foreach ($receipts as $r) {
                $method = $r->payment_method->value ?? $r->payment_method;
                $writer->addRow(new Row([
                    Cell::fromValue($r->receipt_number),
                    Cell::fromValue($r->created_at->format('Y-m-d H:i')),
                    Cell::fromValue($branchNames[$r->branch_id] ?? '-'),
                    Cell::fromValue($r->booking_id ? 'Layanan' : 'Produk'),
                    Cell::fromValue($r->booking?->customer_name ?? '-'),
                    Cell::fromValue($paymentLabels[$method] ?? $method),
                    Cell::fromValue($r->kasir?->name ?? '-'),
                    Cell::fromValue((float) $r->subtotal, $moneyStyle),
                    Cell::fromValue((float) $r->promo_discount, $moneyStyle),
                    Cell::fromValue((float) $r->tip_amount, $moneyStyle),
                    Cell::fromValue((float) $r->total, $moneyStyle),
                ]));
            }

            $writer->addRow(new Row([
                Cell::fromValue('TOTAL', $totalLabel),
                Cell::fromValue('', $totalLabel),
                Cell::fromValue('', $totalLabel),
                Cell::fromValue('', $totalLabel),
                Cell::fromValue('', $totalLabel),
                Cell::fromValue('', $totalLabel),
                Cell::fromValue('', $totalLabel),
                Cell::fromValue((float) $receipts->sum('subtotal'), $totalMoney),
                Cell::fromValue((float) $receipts->sum('promo_discount'), $totalMoney),
                Cell::fromValue((float) $receipts->sum('tip_amount'), $totalMoney),
                Cell::fromValue((float) $receipts->sum('total'), $totalMoney),
            ]));

            // ── Sheet 2: Ringkasan per Cabang ──
            $writer->addNewSheetAndMakeItCurrent();
            $writer->getCurrentSheet()->setName('Ringkasan Cabang');

            $writer->addRow(Row::fromValues(['RINGKASAN PER CABANG'], $titleStyle));
            $writer->addRow(Row::fromValues(['Periode: ' . $periode], $metaStyle));
            $writer->addRow(Row::fromValues(['']));
            $writer->addRow(Row::fromValues(['Cabang', 'Jumlah Transaksi', 'Total Pendapatan'], $headerStyle));

            foreach ($receipts->groupBy('branch_id') as $branchId => $group) {
                $writer->addRow(new Row([
                    Cell::fromValue($branchNames[$branchId] ?? '-'),
                    Cell::fromValue($group->count(), (new Style())->setFormat('#,##0')),
                    Cell::fromValue((float) $group->sum('total'), $moneyStyle),
                ]));
            }
            $writer->addRow(new Row([
                Cell::fromValue('TOTAL', $totalLabel),
                Cell::fromValue($receipts->count(), (new Style())->setFontBold()->setBackgroundColor(Color::rgb(254, 243, 199))->setFormat('#,##0')),
                Cell::fromValue((float) $receipts->sum('total'), $totalMoney),
            ]));

            $writer->close();
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    protected function getViewData(): array
    {
        return [
            'branches' => Branch::orderBy('name')->pluck('name', 'id'),
            'report'   => $this->buildReport(),
        ];
    }
}
