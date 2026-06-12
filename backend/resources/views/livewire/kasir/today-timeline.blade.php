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
        <div class="rounded-xl bg-white dark:bg-gray-800 shadow p-8 text-center text-gray-500 dark:text-gray-400">
            Belum ada booking hari ini.
        </div>
    @else
        <div class="space-y-6">
            @foreach ($groupedBookings as $group)
                @php
                    $barber = $group['barber'];
                    $colorMap = ['teal' => 'bg-teal-500', 'coral' => 'bg-red-400', 'violet' => 'bg-violet-500', 'yellow' => 'bg-yellow-400'];
                    $colorClass = $colorMap[$barber['signature_color'] ?? 'teal'] ?? 'bg-teal-500';
                @endphp
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                    <div class="px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
                        <span class="inline-block w-3 h-3 rounded-full {{ $colorClass }}"></span>
                        <span class="font-semibold text-gray-900 dark:text-white">{{ $barber['name'] }}</span>
                    </div>
                    <div class="divide-y divide-gray-100 dark:divide-gray-700">
                        @foreach ($group['bookings'] as $booking)
                            @php
                                $status = $booking['status'] instanceof \App\Enums\BookingStatus
                                    ? $booking['status']->value
                                    : $booking['status'];
                                $badgeMap = [
                                    'pending_confirmation' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
                                    'confirmed'            => 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
                                    'in_progress'          => 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
                                    'completed'            => 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
                                    'cancelled'            => 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
                                    'expired'              => 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
                                ];
                                $labelMap = [
                                    'pending_confirmation' => 'Menunggu',
                                    'confirmed'            => 'Terkonfirmasi',
                                    'in_progress'          => 'Berlangsung',
                                    'completed'            => 'Selesai',
                                    'cancelled'            => 'Dibatalkan',
                                    'expired'              => 'Kedaluwarsa',
                                ];
                                $scheduledAt = \Carbon\Carbon::parse($booking['scheduled_at'])
                                    ->setTimezone('Asia/Jakarta');
                            @endphp
                            <div class="px-4 py-3 flex flex-wrap items-center gap-3">
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
                                            class="px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                                            Konfirmasi Kedatangan
                                        </button>
                                    @elseif ($status === 'confirmed')
                                        <button wire:click="start('{{ $booking['id'] }}')"
                                            class="px-3 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                                            Mulai Sesi
                                        </button>
                                    @elseif ($status === 'in_progress')
                                        <button wire:click="openPosModal('{{ $booking['id'] }}')"
                                            class="px-3 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition">
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
