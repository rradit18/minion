<div wire:poll.30000ms class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {{-- Transaksi Hari Ini --}}
    <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900/70 ring-1 ring-gray-200 dark:ring-white/10 shadow-sm p-5 transition duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div class="relative flex items-center gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
            </div>
            <div class="min-w-0">
                <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Transaksi Hari Ini</p>
                <p class="mt-0.5 text-2xl font-bold text-gray-900 dark:text-white">{{ $transactionCount }}</p>
            </div>
        </div>
        <div class="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl"></div>
    </div>

    {{-- Total Revenue --}}
    <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900/70 ring-1 ring-gray-200 dark:ring-white/10 shadow-sm p-5 transition duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div class="relative flex items-center gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/30">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <div class="min-w-0">
                <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p class="mt-0.5 text-2xl font-bold text-gray-900 dark:text-white">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</p>
            </div>
        </div>
        <div class="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl"></div>
    </div>

    {{-- Barber On-Shift --}}
    <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900/70 ring-1 ring-gray-200 dark:ring-white/10 shadow-sm p-5 transition duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div class="relative flex items-center gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C9A544] text-white shadow-md shadow-amber-500/30">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </div>
            <div class="min-w-0">
                <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Barber On-Shift</p>
                <p class="mt-0.5 text-2xl font-bold text-gray-900 dark:text-white">{{ $onShiftCount }}</p>
            </div>
        </div>
        <div class="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-[#C9A544]/10 blur-2xl"></div>
    </div>
</div>
