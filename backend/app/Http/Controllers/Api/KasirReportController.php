<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Receipt;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class KasirReportController extends Controller
{
    use ApiResponse;

    public function daily(Request $request): JsonResponse
    {
        $kasir    = $request->user();
        $date     = $request->query('date', today()->toDateString());
        $branchId = $kasir->branch_id;

        $receipts = Receipt::where('branch_id', $branchId)
            ->whereDate('created_at', $date)
            ->with('items', 'kasir:id,name', 'booking.barber:id,name')
            ->get();

        $summary = [
            'date'              => $date,
            'total_transaction' => $receipts->count(),
            'total_revenue'     => (float) $receipts->sum('total'),
            'total_discount'    => (float) $receipts->sum('promo_discount'),
            'total_tip'         => (float) $receipts->sum('tip_amount'),
            'by_payment_method' => $receipts->groupBy(fn($r) => $r->payment_method->value)
                ->map(fn($group) => [
                    'count'   => $group->count(),
                    'revenue' => (float) $group->sum('total'),
                ]),
            'receipts' => $receipts->map(fn($r) => [
                'receipt_number' => $r->receipt_number,
                'booking_number' => $r->booking?->booking_number,
                'barber'         => $r->booking?->barber?->name,
                'subtotal'       => (float) $r->subtotal,
                'promo_discount' => (float) $r->promo_discount,
                'tip_amount'     => (float) $r->tip_amount,
                'total'          => (float) $r->total,
                'payment_method' => $r->payment_method->value,
                'kasir'          => $r->kasir?->name,
                'created_at'     => $r->created_at->setTimezone('Asia/Jakarta')->toIso8601String(),
            ]),
        ];

        return $this->ok('OK', $summary);
    }

    public function export(Request $request): Response
    {
        $kasir    = $request->user();
        $date     = $request->query('date', today()->toDateString());
        $branchId = $kasir->branch_id;

        $receipts = Receipt::where('branch_id', $branchId)
            ->whereDate('created_at', $date)
            ->with('booking.barber:id,name', 'kasir:id,name')
            ->get();

        $filename = "laporan-kasir-{$date}.csv";

        $csv  = "\xEF\xBB\xBF"; // UTF-8 BOM for Excel
        $csv .= "No. Struk,No. Booking,Barber,Subtotal,Diskon,Tip,Total,Metode Bayar,Kasir,Waktu\r\n";

        foreach ($receipts as $r) {
            $csv .= implode(',', [
                $r->receipt_number,
                $r->booking?->booking_number ?? '-',
                $r->booking?->barber?->name ?? '-',
                (float) $r->subtotal,
                (float) $r->promo_discount,
                (float) $r->tip_amount,
                (float) $r->total,
                $r->payment_method->value,
                $r->kasir?->name ?? '-',
                $r->created_at->setTimezone('Asia/Jakarta')->format('Y-m-d H:i:s'),
            ]) . "\r\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
