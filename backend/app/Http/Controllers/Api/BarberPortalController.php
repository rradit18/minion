<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BarberShift;
use App\Models\Booking;
use App\Models\Rating;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BarberPortalController extends Controller
{
    use ApiResponse;

    public function schedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'week_start' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $barber    = $request->user()->barber;
        if (! $barber) {
            return $this->error('Akun ini tidak terhubung dengan data barber.', 404);
        }

        $weekStart = isset($validated['week_start'])
            ? Carbon::parse($validated['week_start'])->startOfDay()
            : Carbon::now()->startOfWeek();
        $weekEnd = $weekStart->copy()->addDays(13)->endOfDay();

        $shifts = BarberShift::with('branch:id,name,slug')
            ->where('barber_id', $barber->id)
            ->whereBetween('shift_date', [$weekStart->toDateString(), $weekEnd->toDateString()])
            ->orderBy('shift_date')
            ->get()
            ->map(function ($shift) {
                $bookings = Booking::with(['services:id,name,duration_minutes'])
                    ->where('barber_id', $shift->barber_id)
                    ->whereDate('scheduled_at', $shift->shift_date)
                    ->whereNotIn('status', ['cancelled', 'expired'])
                    ->orderBy('scheduled_at')
                    ->get(['id', 'booking_number', 'scheduled_at', 'status', 'customer_name']);

                return [
                    'id'          => $shift->id,
                    'branch'      => $shift->branch,
                    'shift_date'  => $shift->shift_date,
                    'start_time'  => $shift->start_time,
                    'end_time'    => $shift->end_time,
                    'break_start' => $shift->break_start,
                    'break_end'   => $shift->break_end,
                    'status'      => $shift->status,
                    'bookings'    => $bookings->map(fn($b) => [
                        'id'             => $b->id,
                        'booking_number' => $b->booking_number,
                        'scheduled_at'   => $b->scheduled_at->setTimezone('Asia/Jakarta')->toIso8601String(),
                        'status'         => $b->status,
                        'customer_name'  => $b->customer_name,
                        'services'       => $b->services->map(fn($s) => [
                            'name'             => $s->name,
                            'duration_minutes' => $s->duration_minutes,
                        ]),
                    ]),
                ];
            });

        return $this->ok('OK', [
            'week_start' => $weekStart->toDateString(),
            'week_end'   => $weekEnd->toDateString(),
            'shifts'     => $shifts,
        ]);
    }

    public function todayBookings(Request $request): JsonResponse
    {
        $barber = $request->user()->barber;
        if (! $barber) {
            return $this->error('Akun ini tidak terhubung dengan data barber.', 404);
        }

        $bookings = Booking::with([
            'branch:id,name,slug',
            'services:id,name,duration_minutes',
        ])
            ->where('barber_id', $barber->id)
            ->whereDate('scheduled_at', today())
            ->whereNotIn('status', ['cancelled', 'expired'])
            ->orderBy('scheduled_at')
            ->get()
            ->map(fn($b) => [
                'id'             => $b->id,
                'booking_number' => $b->booking_number,
                'scheduled_at'   => $b->scheduled_at->setTimezone('Asia/Jakarta')->toIso8601String(),
                'status'         => $b->status,
                'type'           => $b->type,
                'customer_name'  => $b->customer_name,
                'customer_phone' => $b->customer_phone,
                'branch'         => $b->branch,
                'services'       => $b->services->map(fn($s) => [
                    'name'             => $s->name,
                    'duration_minutes' => $s->duration_minutes,
                ]),
            ]);

        return $this->ok('OK', $bookings);
    }

    public function ratings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
        ]);

        $barber = $request->user()->barber;
        if (! $barber) {
            return $this->error('Akun ini tidak terhubung dengan data barber.', 404);
        }

        $month = isset($validated['month'])
            ? Carbon::parse($validated['month'] . '-01')
            : Carbon::now()->startOfMonth();

        $ratingsQuery = Rating::whereHas('booking', fn($q) => $q->where('barber_id', $barber->id))
            ->whereYear('created_at', $month->year)
            ->whereMonth('created_at', $month->month);

        $ratings = $ratingsQuery->get();

        $avgStars = $ratings->avg('stars') ?? 0;

        $distribution = collect([1, 2, 3, 4, 5])->mapWithKeys(
            fn($star) => [$star => $ratings->where('stars', $star)->count()]
        );

        $recentReviews = Rating::with('booking:id,customer_name,customer_user_id')
            ->whereHas('booking', fn($q) => $q->where('barber_id', $barber->id))
            ->whereYear('created_at', $month->year)
            ->whereMonth('created_at', $month->month)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn($r) => [
                'stars'        => $r->stars,
                'comment'      => $r->comment,
                'is_anonymous' => $r->is_anonymous,
                'author'       => $r->is_anonymous ? 'Anonim' : ($r->booking->customer_name ?? 'Pelanggan'),
                'created_at'   => $r->created_at->setTimezone('Asia/Jakarta')->toIso8601String(),
            ]);

        return $this->ok('OK', [
            'month'          => $month->format('Y-m'),
            'avg_stars'      => round($avgStars, 2),
            'total_reviews'  => $ratings->count(),
            'distribution'   => $distribution,
            'recent_reviews' => $recentReviews,
        ]);
    }
}
