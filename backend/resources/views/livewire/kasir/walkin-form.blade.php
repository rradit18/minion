<div class="bg-white dark:bg-gray-900/70 ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl shadow-sm">
    <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Walk-In Booking</h2>
        <div class="flex gap-1">
            @foreach ([1,2,3,4] as $s)
                <span class="w-2 h-2 rounded-full {{ $step >= $s ? 'bg-[#C9A544]' : 'bg-gray-300 dark:bg-gray-600' }}"></span>
            @endforeach
        </div>
    </div>

    {{-- Flash message --}}
    @if ($flashMessage)
        <div class="mx-5 mt-4 rounded-lg p-3 text-sm {{ $flashType === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' }}">
            {{ $flashMessage }}
        </div>
    @endif

    <div class="p-5">

        {{-- Step 1: Phone lookup --}}
        @if ($step === 1)
            <div class="space-y-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">Langkah 1: Cari pelanggan berdasarkan nomor HP</p>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor HP</label>
                    <div class="flex gap-2">
                        <input wire:model="phone" type="tel" placeholder="08xxxxxxxxx"
                            class="flex-1 rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-[#C9A544] focus:border-[#C9A544]">
                        <button wire:click="searchUser" class="px-4 py-2 bg-[#C9A544] hover:bg-[#b8963c] text-gray-900 text-sm font-semibold rounded-lg shadow-sm transition active:scale-95">
                            Cari
                        </button>
                    </div>
                </div>

                @if ($foundUser)
                    <div class="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                        <p class="text-sm font-medium text-green-800 dark:text-green-200">Pelanggan ditemukan:</p>
                        <p class="text-base font-semibold text-gray-900 dark:text-white">{{ $foundUser['name'] }}</p>
                        <p class="text-sm text-gray-500">{{ $foundUser['phone'] }}</p>
                        <button wire:click="useFoundUser" class="mt-3 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition">
                            Gunakan Akun Ini
                        </button>
                    </div>
                @elseif (strlen($phone) >= 8 && !$foundUser)
                    <div class="rounded-lg bg-gray-50 dark:bg-gray-700 p-4">
                        <p class="text-sm text-gray-600 dark:text-gray-300">Pelanggan tidak ditemukan.</p>
                        <div class="mt-3">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Tamu</label>
                            <input wire:model="guestName" type="text" placeholder="Nama pelanggan"
                                class="w-full rounded-lg px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white text-sm">
                        </div>
                        <button wire:click="useGuest" class="mt-3 px-4 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition">
                            Lanjut Sebagai Tamu
                        </button>
                    </div>
                @endif
            </div>
        @endif

        {{-- Step 2: Select services --}}
        @if ($step === 2)
            <div class="space-y-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">Langkah 2: Pilih layanan</p>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    @foreach ($services as $service)
                        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <input type="checkbox" wire:model="selectedServices" value="{{ $service['id'] }}"
                                class="rounded border-gray-300 text-[#C9A544] focus:ring-[#C9A544]">
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ $service['name'] }}</p>
                                <p class="text-xs text-gray-500">{{ $service['duration_minutes'] }} menit</p>
                            </div>
                            <span class="text-sm font-medium text-gray-900 dark:text-white">
                                Rp {{ number_format($service['price'], 0, ',', '.') }}
                            </span>
                        </label>
                    @endforeach
                </div>
                <div class="flex justify-between pt-2">
                    <button wire:click="prevStep" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                        ← Kembali
                    </button>
                    <button wire:click="nextStep" class="px-4 py-2 bg-[#C9A544] hover:bg-[#b8963c] text-gray-900 text-sm font-semibold rounded-lg shadow-sm transition active:scale-95">
                        Lanjut →
                    </button>
                </div>
            </div>
        @endif

        {{-- Step 3: Select barber and slot --}}
        @if ($step === 3)
            <div class="space-y-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">Langkah 3: Pilih barber dan waktu</p>

                @if (empty($availableBarbers))
                    <p class="text-sm text-red-500">Tidak ada barber yang bershift hari ini.</p>
                @else
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Barber</label>
                        <div class="grid grid-cols-2 gap-2">
                            @foreach ($availableBarbers as $barber)
                                <button wire:click="$set('selectedBarberId', '{{ $barber['id'] }}')"
                                    class="p-3 rounded-lg border-2 text-sm font-medium transition {{ $selectedBarberId === $barber['id'] ? 'border-[#C9A544] bg-amber-50 dark:bg-[#C9A544]/10 text-[#C9A544] dark:text-[#d8b85e]' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400' }}">
                                    {{ $barber['name'] }}
                                </button>
                            @endforeach
                        </div>
                    </div>

                    @if ($selectedBarberId && !empty($availableSlots))
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Waktu</label>
                            <div class="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                                @foreach ($availableSlots as $slot)
                                    <button wire:click="$set('selectedSlot', '{{ $slot['datetime'] }}')"
                                        class="p-2 rounded-lg border text-xs font-medium transition {{ $selectedSlot === $slot['datetime'] ? 'border-[#C9A544] bg-amber-50 dark:bg-[#C9A544]/10 text-[#C9A544] dark:text-[#d8b85e]' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400' }}">
                                        {{ $slot['time'] }}
                                    </button>
                                @endforeach
                            </div>
                        </div>
                    @elseif ($selectedBarberId && empty($availableSlots))
                        <p class="text-sm text-red-500">Tidak ada slot tersedia untuk barber ini hari ini.</p>
                    @endif
                @endif

                <div class="flex justify-between pt-2">
                    <button wire:click="prevStep" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                        ← Kembali
                    </button>
                    <button wire:click="nextStep" class="px-4 py-2 bg-[#C9A544] hover:bg-[#b8963c] text-gray-900 text-sm font-semibold rounded-lg shadow-sm transition active:scale-95">
                        Lanjut →
                    </button>
                </div>
            </div>
        @endif

        {{-- Step 4: Preview and confirm --}}
        @if ($step === 4)
            @php
                $selectedBarberName = collect($availableBarbers)->firstWhere('id', $selectedBarberId)['name'] ?? '-';
                $selectedServiceNames = collect($services)->whereIn('id', $selectedServices);
                $totalPrice = $selectedServiceNames->sum('price');
                $slotFormatted = $selectedSlot ? \Carbon\Carbon::parse($selectedSlot)->setTimezone('Asia/Jakarta')->format('H:i') : '-';
                $customerName = $foundUser['name'] ?? $guestName;
            @endphp
            <div class="space-y-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">Langkah 4: Konfirmasi booking walk-in</p>
                <div class="rounded-lg bg-gray-50 dark:bg-gray-700 p-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-500 dark:text-gray-400">Pelanggan</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ $customerName }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500 dark:text-gray-400">Barber</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ $selectedBarberName }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500 dark:text-gray-400">Waktu</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ $slotFormatted }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500 dark:text-gray-400">Layanan</span>
                        <span class="font-medium text-gray-900 dark:text-white text-right">
                            {{ $selectedServiceNames->pluck('name')->implode(', ') }}
                        </span>
                    </div>
                    <div class="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                        <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                        <span class="font-bold text-[#C9A544] dark:text-[#d8b85e]">Rp {{ number_format($totalPrice, 0, ',', '.') }}</span>
                    </div>
                </div>
                <div class="flex justify-between pt-2">
                    <button wire:click="prevStep" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                        ← Kembali
                    </button>
                    <button wire:click="submit" class="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition">
                        Buat Walk-In Booking
                    </button>
                </div>
            </div>
        @endif

    </div>
</div>
