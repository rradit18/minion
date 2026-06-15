<div>
    @if ($done)
        {{-- ═══ Sukses ═══ --}}
        <div class="max-w-md mx-auto text-center space-y-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
            <div>
                <p class="text-lg font-bold text-gray-900 dark:text-white">Penjualan Berhasil!</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    No. Struk: <strong class="text-gray-900 dark:text-white">{{ $receiptNumber }}</strong>
                </p>
            </div>
            <div class="flex items-center justify-center gap-3">
                @if ($receiptId)
                    <a href="{{ route('receipt.show', $receiptId) }}" target="_blank"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition">
                        Cetak Struk
                    </a>
                @endif
                <button wire:click="newSale"
                    class="px-5 py-2 bg-[#C9A544] hover:bg-[#b8963c] text-gray-900 text-sm font-semibold rounded-lg shadow-sm transition active:scale-95">
                    Transaksi Baru
                </button>
            </div>
        </div>
    @else
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {{-- ═══ Daftar produk ═══ --}}
            <div class="lg:col-span-2 space-y-4">
                <input wire:model.live="search" type="text" placeholder="Cari produk…"
                    class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">

                {{-- Filter kategori --}}
                <div class="flex flex-wrap gap-2">
                    <button wire:click="setCategory('')"
                        class="px-4 py-1.5 text-sm font-medium rounded-lg border-2 transition
                            {{ $category === '' ? 'border-[#C9A544] bg-amber-50 dark:bg-[#C9A544]/10 text-[#C9A544] dark:text-[#d8b85e]' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-yellow-400' }}">
                        Semua
                    </button>
                    @foreach ($categories as $value => $label)
                        <button wire:click="setCategory('{{ $value }}')"
                            class="px-4 py-1.5 text-sm font-medium rounded-lg border-2 transition
                                {{ $category === $value ? 'border-[#C9A544] bg-amber-50 dark:bg-[#C9A544]/10 text-[#C9A544] dark:text-[#d8b85e]' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-yellow-400' }}">
                            {{ $label }}
                        </button>
                    @endforeach
                </div>

                @if (empty($visibleProducts))
                    <div class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center text-sm text-gray-500">
                        Tidak ada produk dengan stok tersedia.
                    </div>
                @else
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        @foreach ($visibleProducts as $product)
                            <button wire:click="addToCart('{{ $product['id'] }}')"
                                class="text-left rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-[#C9A544] hover:bg-amber-50 dark:hover:bg-[#C9A544]/10 transition">
                                <div class="aspect-square w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                    @if (!empty($product['image']))
                                        <img src="{{ $product['image'] }}" alt="{{ $product['name'] }}" class="h-full w-full object-cover">
                                    @else
                                        <svg class="h-8 w-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                    @endif
                                </div>
                                <div class="p-3">
                                    <p class="font-medium text-sm text-gray-900 dark:text-white truncate">{{ $product['name'] }}</p>
                                    <p class="text-sm text-[#C9A544] dark:text-[#d8b85e] font-semibold mt-1">
                                        Rp {{ number_format($product['price'], 0, ',', '.') }}
                                    </p>
                                    <p class="text-xs text-gray-400 mt-0.5">Stok: {{ $product['stock'] }}</p>
                                </div>
                            </button>
                        @endforeach
                    </div>
                @endif
            </div>

            {{-- ═══ Keranjang ═══ --}}
            <div class="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 h-fit">
                <h3 class="font-bold text-gray-900 dark:text-white">Keranjang</h3>

                @if ($error)
                    <div class="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300">
                        {{ $error }}
                    </div>
                @endif

                @if (empty($cart))
                    <p class="text-sm text-gray-500">Belum ada item.</p>
                @else
                    <div class="space-y-2">
                        @foreach ($cart as $i => $item)
                            <div class="flex items-center justify-between gap-2 text-sm">
                                <div class="flex-1 min-w-0">
                                    <p class="font-medium text-gray-900 dark:text-white truncate">{{ $item['name'] }}</p>
                                    <p class="text-xs text-gray-500">Rp {{ number_format($item['price'], 0, ',', '.') }}</p>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <button wire:click="decQty({{ $i }})" class="w-6 h-6 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300">−</button>
                                    <span class="w-6 text-center">{{ $item['quantity'] }}</span>
                                    <button wire:click="incQty({{ $i }})" class="w-6 h-6 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300">+</button>
                                    <button wire:click="removeItem({{ $i }})" class="text-red-400 hover:text-red-600 ml-1">✕</button>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <div class="flex justify-between font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-600">
                        <span>Total</span>
                        <span>Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                    </div>

                    {{-- Metode pembayaran --}}
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Pembayaran</p>
                        <div class="grid grid-cols-3 gap-2">
                            @foreach (['cash' => 'Cash', 'bank_transfer' => 'Transfer', 'qris_external' => 'QRIS'] as $method => $label)
                                <button wire:click="setPayment('{{ $method }}')"
                                    class="py-2 text-xs font-medium rounded-lg border-2 transition
                                        {{ $paymentMethod === $method ? 'border-[#C9A544] bg-amber-50 dark:bg-[#C9A544]/10 text-[#C9A544] dark:text-[#d8b85e]' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-yellow-400' }}">
                                    {{ $label }}
                                </button>
                            @endforeach
                        </div>
                    </div>

                    @if ($paymentMethod === 'cash')
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nominal diterima</label>
                            <input wire:model.live="amountPaidInput" type="number" placeholder="Jumlah uang"
                                class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
                            @if ($amountPaidInput)
                                <p class="text-sm text-green-600 dark:text-green-400">
                                    Kembalian: Rp {{ number_format($change, 0, ',', '.') }}
                                </p>
                            @endif
                        </div>
                    @elseif ($paymentMethod === 'bank_transfer')
                        <div class="space-y-2">
                            <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Rekening Tujuan</p>
                            @forelse ($bankAccounts as $acc)
                                <div class="rounded-lg bg-gray-50 dark:bg-gray-700 p-2.5 text-sm">
                                    <p class="font-medium text-gray-900 dark:text-white">{{ $acc['bank_name'] }}</p>
                                    <p class="text-gray-600 dark:text-gray-300 text-xs">{{ $acc['account_number'] }} — {{ $acc['account_holder'] }}</p>
                                </div>
                            @empty
                                <p class="text-sm text-gray-500">Tidak ada rekening terdaftar.</p>
                            @endforelse
                        </div>
                    @elseif ($paymentMethod === 'qris_external')
                        <div class="rounded-lg bg-gray-50 dark:bg-gray-700 p-3 text-center text-sm text-gray-600 dark:text-gray-300">
                            Arahkan pelanggan ke QR fisik di kasir.
                        </div>
                    @endif

                    <button wire:click="checkout"
                        class="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition">
                        Bayar — Rp {{ number_format($subtotal, 0, ',', '.') }}
                    </button>
                @endif
            </div>
        </div>
    @endif
</div>
