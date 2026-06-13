<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Struk - {{ $receipt->receipt_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            padding: 20px 0;
        }
        .receipt {
            width: 300px;
            background: #fff;
            padding: 16px;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .divider { border-top: 1px dashed #333; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; margin: 3px 0; }
        .row .label { flex: 1; }
        .row .amount { text-align: right; min-width: 80px; }
        .total-row { font-weight: bold; font-size: 13px; }
        .brand { font-size: 15px; font-weight: bold; letter-spacing: 1px; }
        .receipt-no { font-size: 11px; color: #555; }
        .footer-msg { font-size: 11px; margin-top: 4px; color: #555; }

        @media print {
            body { background: none; padding: 0; }
            .receipt { width: 80mm; padding: 4mm; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
<div class="receipt">
    {{-- Header --}}
    <div class="center">
        <p class="brand">MINION BARBERSHOP</p>
        <p style="font-size:11px">{{ $receipt->branch->name ?? '' }}</p>
        @if ($receipt->branch?->phone)
            <p style="font-size:11px">{{ $receipt->branch->phone }}</p>
        @endif
    </div>

    <div class="divider"></div>

    <p class="center receipt-no">{{ $receipt->receipt_number }}</p>
    <p class="center receipt-no">{{ $receipt->created_at->setTimezone('Asia/Jakarta')->format('d/m/Y H:i') }}</p>

    @if ($receipt->booking)
        <p class="center receipt-no" style="margin-top:4px">Booking: {{ $receipt->booking->booking_number }}</p>
    @endif

    <div class="divider"></div>

    @if ($receipt->booking?->customer_name)
        <div class="row">
            <span class="label">Pelanggan</span>
            <span class="amount">{{ $receipt->booking->customer_name }}</span>
        </div>
    @endif
    @if ($receipt->booking?->barber)
        <div class="row">
            <span class="label">Barber</span>
            <span class="amount">{{ $receipt->booking->barber->name }}</span>
        </div>
    @endif
    @if ($receipt->kasir)
        <div class="row">
            <span class="label">Kasir</span>
            <span class="amount">{{ $receipt->kasir->name }}</span>
        </div>
    @endif

    <div class="divider"></div>

    {{-- Items --}}
    @foreach ($receipt->items as $item)
        <div class="row">
            <span class="label">{{ $item->item_name }}</span>
            <span class="amount">{{ number_format($item->price, 0, ',', '.') }}</span>
        </div>
    @endforeach

    <div class="divider"></div>

    <div class="row">
        <span class="label">Subtotal</span>
        <span class="amount">{{ number_format($receipt->subtotal, 0, ',', '.') }}</span>
    </div>

    @if ($receipt->promo_discount > 0)
        <div class="row">
            <span class="label">Diskon</span>
            <span class="amount">- {{ number_format($receipt->promo_discount, 0, ',', '.') }}</span>
        </div>
    @endif

    <div class="divider"></div>

    <div class="row total-row">
        <span class="label">TOTAL</span>
        <span class="amount">Rp {{ number_format($receipt->total, 0, ',', '.') }}</span>
    </div>

    <div class="row" style="margin-top:4px; font-size:11px; color:#555">
        <span class="label">Bayar ({{ strtoupper(str_replace('_', ' ', $receipt->payment_method->value)) }})</span>
        <span class="amount">{{ number_format($receipt->amount_paid, 0, ',', '.') }}</span>
    </div>

    @if ($receipt->change_amount > 0)
        <div class="row" style="font-size:11px; color:#555">
            <span class="label">Kembalian</span>
            <span class="amount">{{ number_format($receipt->change_amount, 0, ',', '.') }}</span>
        </div>
    @endif

    @if ($receipt->tip_amount > 0)
        <div class="row" style="font-size:11px; color:#555">
            <span class="label">Tip Barber</span>
            <span class="amount">{{ number_format($receipt->tip_amount, 0, ',', '.') }}</span>
        </div>
    @endif

    <div class="divider"></div>

    <div class="center footer-msg">
        <p>Terima kasih telah berkunjung!</p>
        <p>Sampai jumpa di kunjungan berikutnya.</p>
        <p style="margin-top:6px; font-size:10px; color:#999">minionbarbershop.com</p>
    </div>

    {{-- Print button --}}
    <div class="center no-print" style="margin-top: 16px;">
        <button onclick="window.print()" style="padding:8px 20px;background:#1a1a1a;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:13px;">
            🖨️ Cetak Struk
        </button>
    </div>
</div>
</body>
</html>
