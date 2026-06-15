<x-filament-panels::page>
    @if (auth()->user()?->force_password_change)
        <x-filament::section>
            <x-slot name="heading">Wajib ganti password</x-slot>
            <x-slot name="description">
                Akun Anda dibuat oleh admin dengan password sementara. Demi keamanan,
                silakan atur password baru terlebih dahulu sebelum menggunakan aplikasi.
            </x-slot>
        </x-filament::section>
    @endif

    <form wire:submit="save">
        {{ $this->form }}

        <div class="mt-6">
            <x-filament::button type="submit">
                Simpan Password
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
