<x-filament-panels::page>

    {{-- Summary stats --}}
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 mb-6">
        <x-filament::section>
            <div class="text-center">
                <p class="text-4xl font-bold text-primary-600 dark:text-primary-400">
                    {{ $this->avgRating > 0 ? $this->avgRating : '—' }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Rating Rata-rata</p>
                @if ($this->avgRating > 0)
                    <p class="text-yellow-500 text-lg mt-1">
                        @for ($i = 1; $i <= 5; $i++)
                            {{ $i <= round($this->avgRating) ? '★' : '☆' }}
                        @endfor
                    </p>
                @endif
            </div>
        </x-filament::section>

        <x-filament::section>
            <div class="text-center">
                <p class="text-4xl font-bold text-primary-600 dark:text-primary-400">{{ $this->totalRatings }}</p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Total Ulasan</p>
            </div>
        </x-filament::section>

        <x-filament::section class="col-span-2 lg:col-span-1">
            <div class="space-y-1 text-sm">
                @foreach ([[5, $this->fiveStar], [4, $this->fourStar], [3, $this->threeStar], [2, $this->twoStar], [1, $this->oneStar]] as [$star, $count])
                    <div class="flex items-center gap-2">
                        <span class="w-4 text-right text-gray-500">{{ $star }}</span>
                        <span class="text-yellow-500">★</span>
                        <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            @if ($this->totalRatings > 0)
                                <div class="bg-yellow-400 h-2 rounded-full"
                                     style="width: {{ round(($count / $this->totalRatings) * 100) }}%"></div>
                            @endif
                        </div>
                        <span class="w-4 text-gray-500">{{ $count }}</span>
                    </div>
                @endforeach
            </div>
        </x-filament::section>
    </div>

    {{ $this->table }}

</x-filament-panels::page>
