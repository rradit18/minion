<?php

namespace App\Livewire\Kasir;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Carbon\Carbon;
use Filament\Notifications\Notification;
use Livewire\Component;

/**
 * Pemberitahuan (suara + toast) saat ada booking online yang bukti pembayarannya
 * baru masuk dan menunggu verifikasi kasir. Berbasis polling, tanpa websocket.
 */
class BookingNotifier extends Component
{
    public ?string $lastSeen = null;

    public function mount(): void
    {
        // Mulai dari sekarang agar booking lama tidak memicu bunyi saat halaman dibuka.
        $this->lastSeen = now()->toIso8601String();
    }

    public function check(): void
    {
        $branchId = auth()->user()?->branch_id;
        if (! $branchId) {
            return;
        }

        $latest = Booking::where('branch_id', $branchId)
            ->where('status', BookingStatus::PendingConfirmation)
            ->max('proof_uploaded_at');

        if (! $latest) {
            return;
        }

        $latestAt = Carbon::parse($latest);
        if ($this->lastSeen && ! $latestAt->gt(Carbon::parse($this->lastSeen))) {
            return;
        }

        $this->lastSeen = $latestAt->toIso8601String();

        $count = Booking::where('branch_id', $branchId)
            ->where('status', BookingStatus::PendingConfirmation)
            ->count();

        // Bunyikan suara di browser.
        $this->dispatch('new-booking');

        // Toast Filament.
        Notification::make()
            ->title('Booking baru perlu verifikasi')
            ->body("Ada {$count} booking menunggu verifikasi pembayaran.")
            ->success()
            ->send();
    }

    public function render()
    {
        return view('livewire.kasir.booking-notifier');
    }
}
