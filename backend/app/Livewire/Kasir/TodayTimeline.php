<?php

namespace App\Livewire\Kasir;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Livewire\Component;

class TodayTimeline extends Component
{
    public array $groupedBookings = [];

    protected $listeners = ['booking-updated' => 'loadBookings', 'pos-completed' => 'loadBookings'];

    public function mount(): void
    {
        $this->loadBookings();
    }

    public function loadBookings(): void
    {
        $branchId = auth()->user()->branch_id;

        $this->groupedBookings = Booking::where('branch_id', $branchId)
            ->whereDate('scheduled_at', today())
            ->with(['barber:id,name,signature_color', 'services:id,booking_id,service_name,price'])
            ->orderBy('scheduled_at')
            ->get()
            ->groupBy('barber_id')
            ->map(fn($bookings) => [
                'barber'   => $bookings->first()->barber,
                'bookings' => $bookings->values(),
            ])
            ->values()
            ->toArray();
    }

    public function confirm(string $bookingId): void
    {
        $kasir   = auth()->user();
        $booking = Booking::where('id', $bookingId)
            ->where('branch_id', $kasir->branch_id)
            ->where('status', BookingStatus::PendingConfirmation)
            ->first();

        if (! $booking) {
            session()->flash('error', 'Booking tidak ditemukan atau status tidak valid.');
            return;
        }

        $booking->update([
            'status'       => BookingStatus::Confirmed,
            'confirmed_at' => now(),
        ]);

        $this->loadBookings();
        session()->flash('success', 'Booking #' . $booking->booking_number . ' dikonfirmasi.');
    }

    public function start(string $bookingId): void
    {
        $kasir   = auth()->user();
        $booking = Booking::where('id', $bookingId)
            ->where('branch_id', $kasir->branch_id)
            ->where('status', BookingStatus::Confirmed)
            ->first();

        if (! $booking) {
            session()->flash('error', 'Booking tidak ditemukan atau status tidak valid.');
            return;
        }

        $booking->update([
            'status'     => BookingStatus::InProgress,
            'started_at' => now(),
        ]);

        $this->loadBookings();
        session()->flash('success', 'Sesi dimulai untuk booking #' . $booking->booking_number . '.');
    }

    public function openPosModal(string $bookingId): void
    {
        $this->dispatch('open-pos-modal', bookingId: $bookingId);
    }

    public function render()
    {
        return view('livewire.kasir.today-timeline');
    }
}
