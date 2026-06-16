<?php

namespace App\Filament\Barber\Pages;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Rating;
use Filament\Pages\Page;

class Dashboard extends Page
{
    protected static ?string               $navigationLabel = 'Dashboard';
    protected static ?string               $title           = 'Dashboard';
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-home';
    protected static ?int                  $navigationSort  = 1;
    protected string $view = 'filament.barber.pages.dashboard';

    public int    $todayTotal     = 0;
    public int    $todayDone      = 0;
    public int    $todayRemaining = 0;
    public float  $avgRating      = 0;
    public int    $totalRatings   = 0;
    public ?array $nextBooking    = null;

    public function mount(): void
    {
        $barber = auth()->user()->barber;
        if (! $barber) return;

        $todayBookings = Booking::where('barber_id', $barber->id)
            ->whereDate('scheduled_at', today())
            ->whereNotIn('status', [BookingStatus::Cancelled->value, BookingStatus::Expired->value])
            ->with(['services:id,booking_id,service_name'])
            ->orderBy('scheduled_at')
            ->get();

        $this->todayTotal     = $todayBookings->count();
        $this->todayDone      = $todayBookings->where('status', BookingStatus::Completed)->count();
        $this->todayRemaining = $todayBookings
            ->whereNotIn('status', [BookingStatus::Completed, BookingStatus::Cancelled, BookingStatus::Expired])
            ->count();

        $this->avgRating    = round((float) (Rating::where('barber_id', $barber->id)->avg('stars') ?? 0), 1);
        $this->totalRatings = Rating::where('barber_id', $barber->id)->count();

        $next = $todayBookings
            ->whereNotIn('status', [BookingStatus::Completed, BookingStatus::Cancelled, BookingStatus::Expired])
            ->sortBy('scheduled_at')
            ->first();

        if ($next) {
            $this->nextBooking = [
                'booking_number' => $next->booking_number,
                'customer_name'  => $next->customer_name,
                'customer_phone' => $next->customer_phone,
                'services'       => $next->services->pluck('service_name')->join(', '),
                'scheduled_at'   => $next->scheduled_at->format('H:i'),
                'status'         => $next->status->value,
            ];
        }
    }
}
