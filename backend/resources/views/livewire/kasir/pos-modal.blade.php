@if ($isOpen)
<div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" x-data>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {{-- Header --}}
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
            <div>
                <h2 class="text-base font-bold text-gray-900 dark:text-white">Point of Sale</h2>
                @if (!empty($booking['booking_number']))
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        #{{ $booking['booking_number'] }} — {{ $booking['customer_name'] }}
                    </p>
                @endif
            </div>
            @if ($step !== 'done')
                {{-- Step indicator --}}
                <div class="flex items-center gap-1.5">
                    @foreach (['review' => '1', 'promo' => '2', 'tip' => '3', 'payment' => '4', 'confirm' => '5'] as $s => $n)
                        <div class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
                            {{ $step === $s ? 'bg-yellow-500 text-white' : (array_search($step, ['review','promo','tip','payment','confirm']) > array_search($s, ['review','promo','tip','payment','confirm']) ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500') }}">
                            {{ $n }}
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        {{-- Body --}}
        <div class="flex-1 overflow-y-auto p-6 space-y-4">

            {{-- Error message --}}
            @if ($promoError)
                <div class="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300">
                    {{ $promoError }}
                </div>
            @endif

            {{-- ═══ STEP: review ═══ --}}
            @if ($step === 'review')
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Layanan</p>
                    <div class="space-y-2">
                        @foreach ($booking['services'] ?? [] as $svc)
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-900 dark:text-white">{{ $svc['item_name'] }}</span>
                                <span class="font-medium">Rp {{ number_format($svc['price'], 0, ',', '.') }}</span>
                            </div>
                        @endforeach

                        @foreach ($addons as $i => $addon)
                            <div class="flex justify-between text-sm items-center">
                                <span class="text-gray-900 dark:text-white">{{ $addon['item_name'] }} <span class="text-xs text-gray-400">(tambahan)</span></span>
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">Rp {{ number_format($addon['price'], 0, ',', '.') }}</span>
                                    <button wire:click="removeAddon({{ $i }})" class="text-red-400 hover:text-red-600 text-xs">✕</button>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    {{-- Add-on picker --}}
                    <div class="mt-4">
                        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">+ Tambah Layanan</p>
                        <div class="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                            @foreach ($branchServices as $svc)
                                @if (!collect($booking['services'])->contains('service_id', $svc['service_id']) && !collect($addons)->contains('service_id', $svc['service_id']))
                                    <button wire:click="addAddon('{{ $svc['service_id'] }}')"
                                        class="text-left p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition text-xs">
                                        <p class="font-medium text-gray-900 dark:text-white">{{ $svc['item_name'] }}</p>
                                        <p class="text-gray-500">Rp {{ number_format($svc['price'], 0, ',', '.') }}</p>
                                    </button>
                                @endif
                            @endforeach
                        </div>
                    </div>

                    <div class="flex justify-between font-semibold text-sm mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <span>Subtotal</span>
                        <span>Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                    </div>
                </div>
            @endif

            {{-- ═══ STEP: promo ═══ --}}
            @if ($step === 'promo')
                <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Masukkan kode promo (opsional).</p>

                    @if (!empty($appliedPromo))
                        <div class="flex items-center justify-between rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
                            <div>
                                <p class="text-sm font-semibold text-green-700 dark:text-green-300">{{ $appliedPromo['code'] }}</p>
                                <p class="text-xs text-green-600 dark:text-green-400">{{ $appliedPromo['name'] }}</p>
                                <p class="text-xs text-green-600 dark:text-green-400">Diskon: Rp {{ number_format($promoDiscount, 0, ',', '.') }}</p>
                            </div>
                            <button wire:click="removePromo" class="text-red-500 hover:text-red-700 text-xs">Hapus</button>
                        </div>
                    @else
                        <div class="flex gap-2">
                            <input wire:model="promoCode" type="text" placeholder="Kode promo" class="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm uppercase">
                            <button wire:click="validatePromo" class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition">
                                Pakai
                            </button>
                        </div>
                    @endif

                    <div class="text-sm space-y-1 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div class="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Subtotal</span><span>Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                        </div>
                        <div class="flex justify-between text-green-600 dark:text-green-400">
                            <span>Diskon</span><span>- Rp {{ number_format($promoDiscount, 0, ',', '.') }}</span>
                        </div>
                        <div class="flex justify-between font-bold text-gray-900 dark:text-white">
                            <span>Total</span><span>Rp {{ number_format($total, 0, ',', '.') }}</span>
                        </div>
                    </div>
                </div>
            @endif

            {{-- ═══ STEP: tip ═══ --}}
            @if ($step === 'tip')
                <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Tip untuk barber (opsional).</p>
                    <div class="grid grid-cols-4 gap-2">
                        @foreach ([0, 5000, 10000, 20000] as $preset)
                            <button wire:click="setTip({{ $preset }})"
                                class="py-2 text-sm font-medium rounded-lg border transition
                                    {{ $tipAmount === $preset ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400' }}">
                                {{ $preset === 0 ? 'Tidak' : 'Rp ' . number_format($preset, 0, ',', '.') }}
                            </button>
                        @endforeach
                    </div>
                    <div class="flex gap-2">
                        <input wire:model="customTipInput" type="number" placeholder="Nominal custom"
                            class="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
                        <button wire:click="applyCustomTip" class="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                            Set
                        </button>
                    </div>
                    @if ($tipAmount > 0)
                        <p class="text-sm text-center text-yellow-600 dark:text-yellow-400 font-medium">
                            Tip: Rp {{ number_format($tipAmount, 0, ',', '.') }}
                        </p>
                    @endif
                </div>
            @endif

            {{-- ═══ STEP: payment ═══ --}}
            @if ($step === 'payment')
                <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Pilih metode pembayaran.</p>
                    <div class="grid grid-cols-3 gap-3">
                        @foreach (['cash' => 'Cash', 'bank_transfer' => 'Transfer Bank', 'qris_external' => 'QRIS'] as $method => $label)
                            <button wire:click="setPayment('{{ $method }}')"
                                class="py-3 text-sm font-medium rounded-xl border-2 transition
                                    {{ $paymentMethod === $method ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-yellow-400' }}">
                                {{ $label }}
                            </button>
                        @endforeach
                    </div>

                    @if ($paymentMethod === 'cash')
                        <div class="space-y-2">
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Total: <strong>Rp {{ number_format($total, 0, ',', '.') }}</strong>
                            </p>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nominal diterima</label>
                            <input wire:model.live="amountPaidInput" type="number" placeholder="Masukkan jumlah uang"
                                class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
                            @if ($amountPaidInput)
                                <p class="text-sm {{ $change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500' }}">
                                    Kembalian: Rp {{ number_format($change, 0, ',', '.') }}
                                </p>
                            @endif
                        </div>
                    @elseif ($paymentMethod === 'bank_transfer')
                        <div class="space-y-2">
                            <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Rekening Tujuan</p>
                            @forelse ($bankAccounts as $acc)
                                <div class="rounded-lg bg-gray-50 dark:bg-gray-700 p-3 text-sm">
                                    <p class="font-medium text-gray-900 dark:text-white">{{ $acc['bank_name'] }}</p>
                                    <p class="text-gray-600 dark:text-gray-300">{{ $acc['account_number'] }} — {{ $acc['account_holder'] }}</p>
                                </div>
                            @empty
                                <p class="text-sm text-gray-500">Tidak ada rekening yang terdaftar.</p>
                            @endforelse
                        </div>
                    @elseif ($paymentMethod === 'qris_external')
                        <div class="rounded-lg bg-gray-50 dark:bg-gray-700 p-4 text-center">
                            <p class="text-sm text-gray-600 dark:text-gray-300">Arahkan pelanggan ke QR fisik di kasir.</p>
                            <p class="text-lg font-bold text-gray-900 dark:text-white mt-2">
                                Rp {{ number_format($total, 0, ',', '.') }}
                            </p>
                        </div>
                    @endif
                </div>
            @endif

            {{-- ═══ STEP: confirm ═══ --}}
            @if ($step === 'confirm')
                <div class="space-y-3 text-sm">
                    <div class="rounded-lg bg-gray-50 dark:bg-gray-700 p-4 space-y-2">
                        <div class="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Subtotal</span><span>Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                        </div>
                        @if ($promoDiscount > 0)
                            <div class="flex justify-between text-green-600 dark:text-green-400">
                                <span>Diskon ({{ $appliedPromo['code'] ?? '' }})</span>
                                <span>- Rp {{ number_format($promoDiscount, 0, ',', '.') }}</span>
                            </div>
                        @endif
                        @if ($tipAmount > 0)
                            <div class="flex justify-between text-blue-600 dark:text-blue-400">
                                <span>Tip Barber</span><span>Rp {{ number_format($tipAmount, 0, ',', '.') }}</span>
                            </div>
                        @endif
                        <div class="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-500 pt-2">
                            <span>Total Tagihan</span><span>Rp {{ number_format($total, 0, ',', '.') }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                            <span>Metode</span>
                            <span>{{ ['cash' => 'Cash', 'bank_transfer' => 'Transfer Bank', 'qris_external' => 'QRIS'][$paymentMethod] ?? $paymentMethod }}</span>
                        </div>
                    </div>
                </div>
            @endif

            {{-- ═══ STEP: done ═══ --}}
            @if ($step === 'done')
                <div class="text-center space-y-4 py-4">
                    <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                        <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">Pembayaran Berhasil!</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">No. Struk: <strong class="text-gray-900 dark:text-white">{{ $receiptNumber }}</strong></p>
                    </div>
                    @if ($receiptId)
                        <a href="{{ route('receipt.show', $receiptId) }}" target="_blank"
                            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4"/>
                            </svg>
                            Cetak Struk
                        </a>
                    @endif
                </div>
            @endif

        </div>

        {{-- Footer --}}
        <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between flex-shrink-0">
            @if ($step === 'done')
                <div></div>
                <button wire:click="close" class="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-lg transition">
                    Selesai
                </button>
            @else
                <button wire:click="{{ $step === 'review' ? 'close' : 'prevStep' }}"
                    class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                    {{ $step === 'review' ? 'Batal' : '← Kembali' }}
                </button>

                @if ($step === 'confirm')
                    @php
                        $btnLabel = match($paymentMethod) {
                            'cash'          => 'Konfirmasi Pembayaran Cash',
                            'bank_transfer' => 'Konfirmasi Transfer Diterima',
                            'qris_external' => 'Konfirmasi QRIS Diterima',
                            default         => 'Konfirmasi',
                        };
                    @endphp
                    <button wire:click="confirmPayment" class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition">
                        {{ $btnLabel }}
                    </button>
                @else
                    <button wire:click="nextStep" class="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-lg transition">
                        Lanjut →
                    </button>
                @endif
            @endif
        </div>

    </div>
</div>
@endif
