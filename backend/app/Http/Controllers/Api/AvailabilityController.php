<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AvailabilityService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    use ApiResponse;

    public function __construct(private AvailabilityService $availability) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'barber_id'    => ['required', 'uuid', 'exists:barbers,id'],
            'date'         => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'service_ids'  => ['required', 'array', 'min:1'],
            'service_ids.*'=> ['uuid', 'exists:services,id'],
        ]);

        $slots = $this->availability->getAvailableSlots(
            $request->barber_id,
            $request->date,
            $request->service_ids,
        );

        return $this->ok('OK', $slots);
    }
}
