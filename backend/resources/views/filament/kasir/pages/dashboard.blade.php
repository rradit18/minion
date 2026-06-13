<x-filament-panels::page>
    {{-- Quick stats header --}}
    @livewire(\App\Livewire\Kasir\QuickStats::class)

    {{-- Today timeline --}}
    <div class="mt-6">
        @livewire(\App\Livewire\Kasir\TodayTimeline::class)
    </div>

    {{-- Walk-in form + Shift calendar --}}
    <div class="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        @livewire(\App\Livewire\Kasir\WalkinForm::class)
        @livewire(\App\Livewire\Kasir\ShiftCalendar::class)
    </div>

    {{-- POS Modal (hidden until triggered) --}}
    @livewire(\App\Livewire\Kasir\PosModal::class)
</x-filament-panels::page>
