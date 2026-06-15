@php
    $proofUrl = $booking->payment_proof_path
        ? \Illuminate\Support\Facades\Storage::disk('public')->url($booking->payment_proof_path)
        : null;
    $methodLabel = match ($booking->payment_method) {
        'bank_transfer' => 'Transfer Bank',
        'qris_external' => 'QRIS',
        default         => $booking->payment_method ?? '-',
    };
@endphp

<div class="space-y-3 text-sm">
    <div class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">Booking</span>
        <span class="font-medium text-gray-900 dark:text-white">#{{ $booking->booking_number }}</span>
    </div>
    <div class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">Pelanggan</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ $booking->customer_name }}</span>
    </div>
    <div class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">Metode</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ $methodLabel }}</span>
    </div>
    <div class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">Total</span>
        <span class="font-bold text-gray-900 dark:text-white">Rp {{ number_format($booking->total_price, 0, ',', '.') }}</span>
    </div>
    @if ($booking->proof_uploaded_at)
        <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Diunggah</span>
            <span class="text-gray-900 dark:text-white">{{ $booking->proof_uploaded_at->setTimezone('Asia/Jakarta')->format('d M Y H:i') }}</span>
        </div>
    @endif

    <div>
        <p class="text-gray-500 dark:text-gray-400 mb-2">Bukti Transfer</p>
        @if ($proofUrl)
            <a href="{{ $proofUrl }}" target="_blank">
                <img src="{{ $proofUrl }}" alt="Bukti transfer"
                    class="w-full max-h-96 object-contain rounded-lg border border-gray-200 dark:border-gray-700">
            </a>
            <p class="text-xs text-gray-400 mt-1">Klik gambar untuk memperbesar.</p>
        @else
            <p class="text-red-500">Bukti transfer belum diunggah.</p>
        @endif
    </div>
</div>
