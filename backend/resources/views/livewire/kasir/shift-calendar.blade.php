<div>
    {{-- Flash --}}
    @if ($flashMessage)
        <div class="mb-4 rounded-lg p-3 text-sm {{ $flashType === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' }}">
            {{ $flashMessage }}
        </div>
    @endif

    {{-- Header --}}
    <div class="bg-white dark:bg-gray-900/70 ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl shadow-sm">
        <div class="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/60 dark:bg-white/[0.02]">
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Jadwal Shift Barber</h2>
            <div class="flex items-center gap-2">
                <button wire:click="prevWeek" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <svg class="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <span class="text-sm text-gray-600 dark:text-gray-300">
                    {{ \Carbon\Carbon::parse($weekStart)->isoFormat('D MMM') }} –
                    {{ \Carbon\Carbon::parse($weekStart)->addDays(6)->isoFormat('D MMM YYYY') }}
                </span>
                <button wire:click="nextWeek" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <svg class="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>

        {{-- Calendar table --}}
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-100 dark:border-gray-700">
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-32">Barber</th>
                        @foreach ($weekDates as $day)
                            <th class="px-2 py-3 text-center text-xs font-medium {{ today()->toDateString() === $day['date'] ? 'text-[#C9A544] dark:text-[#d8b85e]' : 'text-gray-500 dark:text-gray-400' }}">
                                {{ $day['label'] }}
                            </th>
                        @endforeach
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    @forelse ($barbers as $barber)
                        <tr>
                            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white text-xs">{{ $barber['name'] }}</td>
                            @foreach ($weekDates as $day)
                                @php
                                    $shift = $shifts[$barber['id']][$day['date']] ?? null;
                                    $isCancelled = $shift && ($shift['status'] === 'cancelled');
                                @endphp
                                <td class="px-2 py-3 text-center">
                                    <button
                                        wire:click="openShiftForm('{{ $barber['id'] }}', '{{ $day['date'] }}')"
                                        class="w-full rounded-lg px-2 py-1.5 text-xs transition
                                            {{ $shift && !$isCancelled
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/40'
                                                : ($isCancelled
                                                    ? 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600')
                                            }}"
                                    >
                                        @if ($shift && !$isCancelled)
                                            {{ $shift['start_time'] }}<br>{{ $shift['end_time'] }}
                                        @elseif ($isCancelled)
                                            Dibatalkan
                                        @else
                                            + Shift
                                        @endif
                                    </button>
                                </td>
                            @endforeach
                        </tr>
                    @empty
                        <tr>
                            <td colspan="{{ count($weekDates) + 1 }}" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                Tidak ada barber assigned di cabang ini.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- Shift form modal --}}
    @if ($showForm)
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl shadow-2xl w-full max-w-md">
                <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
                        {{ $formShiftId ? 'Edit Shift' : 'Tambah Shift' }}
                    </h3>
                    <button wire:click="closeForm" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="p-5 space-y-4">
                    @if ($conflictError)
                        <div class="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300">
                            {{ $conflictError }}
                        </div>
                    @endif

                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        Tanggal: <strong>{{ \Carbon\Carbon::parse($formDate)->isoFormat('dddd, D MMMM YYYY') }}</strong>
                    </p>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Mulai</label>
                            <input wire:model="formStartTime" type="time"
                                class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Selesai</label>
                            <input wire:model="formEndTime" type="time"
                                class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Istirahat Mulai</label>
                            <input wire:model="formBreakStart" type="time"
                                class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Istirahat Selesai</label>
                            <input wire:model="formBreakEnd" type="time"
                                class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm">
                        </div>
                    </div>
                </div>
                <div class="px-5 pb-5 flex gap-3 justify-end">
                    @if ($formShiftId)
                        <button wire:click="cancelShift" class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 transition">
                            Batalkan Shift
                        </button>
                    @endif
                    <button wire:click="closeForm" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 transition">
                        Tutup
                    </button>
                    <button wire:click="saveShift" class="px-4 py-2 bg-[#C9A544] hover:bg-[#b8963c] text-gray-900 text-sm font-semibold rounded-lg shadow-sm transition active:scale-95">
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    @endif
</div>
