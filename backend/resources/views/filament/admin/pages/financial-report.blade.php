<x-filament-panels::page>
    {{-- ── Filter ── --}}
    <x-filament::section>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cabang</label>
                <select wire:model.live="branchId"
                    class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
                    <option value="">Semua Cabang</option>
                    @foreach ($branches as $id => $name)
                        <option value="{{ $id }}">{{ $name }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dari tanggal</label>
                <input wire:model.live="from" type="date"
                    class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sampai tanggal</label>
                <input wire:model.live="until" type="date"
                    class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
            </div>
            <div>
                <x-filament::button wire:click="export" icon="heroicon-o-arrow-down-tray" class="w-full justify-center">
                    Export Excel
                </x-filament::button>
            </div>
        </div>
    </x-filament::section>

    {{-- ── Ringkasan ── --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <x-filament::section>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Pendapatan</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">Rp {{ number_format($report['total'], 0, ',', '.') }}</p>
        </x-filament::section>
        <x-filament::section>
            <p class="text-sm text-gray-500 dark:text-gray-400">Jumlah Transaksi</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ number_format($report['count'], 0, ',', '.') }}</p>
        </x-filament::section>
        <x-filament::section>
            <p class="text-sm text-gray-500 dark:text-gray-400">Rata-rata / Transaksi</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">Rp {{ number_format($report['avg'], 0, ',', '.') }}</p>
        </x-filament::section>
        <x-filament::section>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Tip Barber</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">Rp {{ number_format($report['tip'], 0, ',', '.') }}</p>
        </x-filament::section>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {{-- Layanan vs Produk --}}
        <x-filament::section heading="Layanan vs Produk">
            <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-300">Layanan ({{ $report['service_count'] }} transaksi)</span>
                    <span class="font-semibold">Rp {{ number_format($report['service_total'], 0, ',', '.') }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-300">Produk ({{ $report['product_count'] }} transaksi)</span>
                    <span class="font-semibold">Rp {{ number_format($report['product_total'], 0, ',', '.') }}</span>
                </div>
            </div>
        </x-filament::section>

        {{-- Metode pembayaran --}}
        <x-filament::section heading="Per Metode Pembayaran">
            @if (empty($report['by_payment']))
                <p class="text-sm text-gray-500">Belum ada data.</p>
            @else
                <div class="space-y-3 text-sm">
                    @foreach ($report['by_payment'] as $row)
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-300">{{ $row['label'] }} ({{ $row['count'] }})</span>
                            <span class="font-semibold">Rp {{ number_format($row['total'], 0, ',', '.') }}</span>
                        </div>
                    @endforeach
                </div>
            @endif
        </x-filament::section>
    </div>

    {{-- Per cabang --}}
    <x-filament::section heading="Pendapatan per Cabang">
        @if (empty($report['by_branch']))
            <p class="text-sm text-gray-500">Tidak ada transaksi pada rentang ini.</p>
        @else
            <table class="w-full text-sm">
                <thead>
                    <tr class="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th class="py-2">Cabang</th>
                        <th class="py-2 text-right">Transaksi</th>
                        <th class="py-2 text-right">Total Pendapatan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($report['by_branch'] as $row)
                        <tr class="border-b border-gray-100 dark:border-gray-700/50">
                            <td class="py-2 text-gray-900 dark:text-white">{{ $row['branch'] }}</td>
                            <td class="py-2 text-right">{{ number_format($row['count'], 0, ',', '.') }}</td>
                            <td class="py-2 text-right font-semibold">Rp {{ number_format($row['total'], 0, ',', '.') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </x-filament::section>
</x-filament-panels::page>
