<x-filament-panels::page>

    {{-- Stats --}}
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <x-filament::section>
            <div class="text-center">
                <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ $this->todayTotal }}</p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Total Booking</p>
            </div>
        </x-filament::section>

        <x-filament::section>
            <div class="text-center">
                <p class="text-3xl font-bold text-success-600 dark:text-success-400">{{ $this->todayDone }}</p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Selesai</p>
            </div>
        </x-filament::section>

        <x-filament::section>
            <div class="text-center">
                <p class="text-3xl font-bold text-warning-600 dark:text-warning-400">{{ $this->todayRemaining }}</p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Sisa Antrian</p>
            </div>
        </x-filament::section>

        <x-filament::section>
            <div class="text-center">
                <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {{ $this->avgRating > 0 ? $this->avgRating . ' ★' : '—' }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Rating ({{ $this->totalRatings }} ulasan)</p>
            </div>
        </x-filament::section>
    </div>

    {{-- Next Booking --}}
    <div class="mt-6">
        <x-filament::section>
            <x-slot name="heading">Pelanggan Berikutnya</x-slot>

            @if ($this->nextBooking)
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-lg font-semibold text-gray-900 dark:text-white">
                            {{ $this->nextBooking['customer_name'] }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ $this->nextBooking['services'] }}</p>
                        @if ($this->nextBooking['customer_phone'])
                            <p class="mt-1 text-xs text-gray-400">
                                📞 {{ $this->nextBooking['customer_phone'] }}
                            </p>
                        @endif
                        <p class="mt-1 text-xs text-gray-400">No. {{ $this->nextBooking['booking_number'] }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-4xl font-bold text-primary-600 dark:text-primary-400">
                            {{ $this->nextBooking['scheduled_at'] }}
                        </p>
                        <p class="mt-1 text-xs text-gray-500">WIB</p>
                    </div>
                </div>
            @else
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada booking tersisa hari ini. Selamat beristirahat!
                </p>
            @endif
        </x-filament::section>
    </div>

</x-filament-panels::page>
