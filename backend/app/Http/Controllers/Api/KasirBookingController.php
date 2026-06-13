<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\CheckoutService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KasirBookingController extends Controller
{
    use ApiResponse;

    public function __construct(private CheckoutService $checkoutService) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate(['date' => ['nullable', 'date_format:Y-m-d']]);

        $kasir = $request->user();

        $date   = $request->query('date', today()->toDateString());
        $status = $request->query('status');

        $query = Booking::where('branch_id', $kasir->branch_id)
            ->whereDate('scheduled_at', $date)
            ->with(['barber:id,name', 'services'])
            ->orderBy('scheduled_at');

        if ($status) {
            $statusEnum = BookingStatus::tryFrom($status);
            if (! $statusEnum) {
                return $this->error('Status tidak valid.', 422);
            }
            $query->where('status', $statusEnum);
        }

        $bookings = $query->get()->map(fn($b) => [
            'id'                   => $b->id,
            'booking_number'       => $b->booking_number,
            'customer_name'        => $b->customer_name,
            'customer_phone'       => $b->customer_phone,
            'barber'               => $b->barber->name,
            'services'             => $b->services->map(fn($s) => $s->service_name),
            'scheduled_at'         => $b->scheduled_at->toIso8601String(),
            'total_price'          => (float) $b->total_price,
            'total_duration_minutes' => $b->total_duration_minutes,
            'status'               => $b->status->value,
            'type'                 => $b->type->value,
        ]);

        return $this->ok('OK', $bookings);
    }

    public function confirm(Request $request, string $id): JsonResponse
    {
        $kasir   = $request->user();
        $booking = Booking::where('id', $id)
            ->where('branch_id', $kasir->branch_id)
            ->where('status', BookingStatus::PendingConfirmation)
            ->firstOrFail();

        $booking->update([
            'status'       => BookingStatus::Confirmed,
            'confirmed_at' => now(),
        ]);

        return $this->updated('Booking dikonfirmasi.', $booking->id);
    }

    public function start(Request $request, string $id): JsonResponse
    {
        $kasir   = $request->user();
        $booking = Booking::where('id', $id)
            ->where('branch_id', $kasir->branch_id)
            ->where('status', BookingStatus::Confirmed)
            ->firstOrFail();

        $booking->update([
            'status'     => BookingStatus::InProgress,
            'started_at' => now(),
        ]);

        return $this->updated('Sesi dimulai.', $booking->id);
    }

    public function checkout(Request $request, string $id): JsonResponse
    {
        $kasir = $request->user();

        $booking = Booking::where('id', $id)
            ->where('branch_id', $kasir->branch_id)
            ->where('status', BookingStatus::InProgress)
            ->with('services')
            ->firstOrFail();

        $validated = $request->validate([
            'payment_method' => ['required', Rule::enum(PaymentMethod::class)],
            'tip_amount'     => ['nullable', 'numeric', 'min:0'],
            'promo_code'     => ['nullable', 'string'],
            'amount_paid'    => [
                Rule::requiredIf($request->input('payment_method') === PaymentMethod::Cash->value),
                'nullable', 'numeric', 'min:0',
            ],
        ]);

        try {
            $receipt = $this->checkoutService->checkout($booking, $validated, $kasir);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), $e->getCode() ?: 422);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Checkout berhasil.',
            'data'    => [
                'id'             => $receipt->id,
                'receipt_number' => $receipt->receipt_number,
                'booking_number' => $booking->booking_number,
                'items'          => $receipt->items->map(fn($i) => [
                    'name'     => $i->item_name,
                    'price'    => (float) $i->price,
                    'quantity' => $i->quantity,
                    'subtotal' => (float) $i->subtotal,
                ]),
                'subtotal'       => (float) $receipt->subtotal,
                'promo_discount' => (float) $receipt->promo_discount,
                'tip_amount'     => (float) $receipt->tip_amount,
                'total'          => (float) $receipt->total,
                'payment_method' => $receipt->payment_method->value,
                'amount_paid'    => $receipt->amount_paid !== null ? (float) $receipt->amount_paid : null,
                'change_amount'  => $receipt->change_amount !== null ? (float) $receipt->change_amount : null,
            ],
        ], 201);
    }
}
