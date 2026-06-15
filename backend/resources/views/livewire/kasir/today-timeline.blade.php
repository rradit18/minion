<div wire:poll.10000ms>
    {{-- Flash messages --}}
    @if (session('success'))
        <div class="mb-4 rounded-lg bg-green-50 dark:bg-green-900/30 p-3 text-sm text-green-700 dark:text-green-300">
            {{ session('success') }}
        </div>
    @endif
    @if (session('error'))
        <div class="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-300">
            {{ session('error') }}
        </div>
    @endif

    <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Antrean Hari Ini — {{ today()->isoFormat('dddd, D MMMM YYYY') }}
        </h2>
    </div>

    @if (empty($groupedBookings))
        <div class="rounded-2xl bg-white dark:bg-gray-900/70 ring-1 ring-gray-200 dark:ring-white/10 shadow-sm p-10 text-center text-gray-500 dark:text-gray-400">
            <svg class="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Belum ada booking hari ini.
        </div>
    @else
        <div class="space-y-6">
            @foreach ($groupedBookings as $group)
                @php
                    $barber = $group['barber'];
                    $colorMap = ['teal' => 'bg-teal-500', 'coral' => 'bg-red-400', 'violet' => 'bg-violet-500', 'yellow' => 'bg-yellow-400'];
                    $sig = $barber['signature_color'] ?? null;
                    $sigValue = $sig instanceof \App\Enums\BarberSignatureColor ? $sig->value : ($sig ?: 'teal');
                    $colorClass = $colorMap[$sigValue] ?? 'bg-teal-500';
                @endphp
                <div class="bg-white dark:bg-gray-900/70 ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl shadow-sm overflow-hidden">
                    <div class="px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/60 dark:bg-white/[0.02]">
                        <span class="inline-block w-2.5 h-2.5 rounded-full {{ $colorClass }} ring-2 ring-white/60 dark:ring-white/10"></span>
                        <span class="font-semibold text-gray-900 dark:text-white">{{ $barber['name'] }}</span>
                    </div>
                    <div class="divide-y divide-gray-100 dark:divide-gray-700">
                        @foreach ($group['bookings'] as $booking)
                            @php
                                $status = $booking['status'] instanceof \App\Enums\BookingStatus
                                    ? $booking['status']->value
                                    : $booking['status'];
                                $badgeMap = [
                                    'pending_payment'      => 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
                                    'pending_confirmation' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
                                    'confirmed'            => 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
                                    'in_progress'          => 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
                                    'completed'            => 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
                                    'cancelled'            => 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
                                    'expired'              => 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
                                ];
                                $labelMap = [
                                    'pending_payment'      => 'Menunggu Bayar',
                                    'pending_confirmation' => 'Menunggu Verifikasi',
                                    'confirmed'            => 'Terkonfirmasi',
                                    'in_progress'          => 'Berlangsung',
                                    'completed'            => 'Selesai',
                                    'cancelled'            => 'Dibatalkan',
                                    'expired'              => 'Kedaluwarsa',
                                ];
                                $scheduledAt = \Carbon\Carbon::parse($booking['scheduled_at'])
                                    ->setTimezone('Asia/Jakarta');
                            @endphp
                            <div class="px-4 py-3 flex flex-wrap items-center gap-3 transition hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                                <div class="w-14 text-sm font-mono font-medium text-gray-700 dark:text-gray-300">
                                    {{ $scheduledAt->format('H:i') }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {{ $booking['customer_name'] }}
                                        <span class="text-xs text-gray-400 ml-1">#{{ $booking['booking_number'] }}</span>
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {{ collect($booking['services'])->pluck('service_name')->implode(', ') }}
                                    </p>
                                </div>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {{ $badgeMap[$status] ?? '' }}">
                                    {{ $labelMap[$status] ?? $status }}
                                </span>
                                <div class="flex gap-2">
                                    @if ($status === 'pending_confirmation')
                                        <button wire:click="confirm('{{ $booking['id'] }}')"
                                            class="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition active:scale-95">
                                            Konfirmasi Kedatangan
                                        </button>
                                    @elseif ($status === 'confirmed')
                                        <button wire:click="start('{{ $booking['id'] }}')"
                                            class="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition active:scale-95">
                                            Mulai Sesi
                                        </button>
                                    @elseif ($status === 'in_progress')
                                        <button wire:click="openPosModal('{{ $booking['id'] }}')"
                                            class="px-3 py-1.5 text-xs font-semibold bg-[#C9A544] hover:bg-[#b8963c] text-gray-900 rounded-lg shadow-sm transition active:scale-95">
                                            Selesai (POS)
                                        </button>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>
