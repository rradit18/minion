<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Service;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $services = Service::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'description', 'duration_minutes', 'default_price']);

        return $this->ok('OK', $services);
    }

    public function byBranch(string $branchId): JsonResponse
    {
        $branch = Branch::find($branchId);

        if (! $branch) {
            return $this->error('Cabang tidak ditemukan.', 404);
        }

        $services = $branch->servicePrices()
            ->where('branch_service_prices.is_active', true)
            ->with('service:id,name,description,duration_minutes,sort_order')
            ->get()
            ->sortBy(fn($sp) => $sp->service->sort_order)
            ->values()
            ->map(fn($sp) => [
                'id'               => $sp->service->id,
                'name'             => $sp->service->name,
                'description'      => $sp->service->description,
                'duration_minutes' => $sp->service->duration_minutes,
                'price'            => (float) $sp->price,
            ]);

        return $this->ok('OK', $services);
    }

    public function barbersByBranch(string $branchId): JsonResponse
    {
        $branch = Branch::find($branchId);

        if (! $branch) {
            return $this->error('Cabang tidak ditemukan.', 404);
        }

        $today = now()->toDateString();

        $barbers = $branch->barbers()
            ->where('barbers.is_active', true)
            ->with(['shifts' => fn($q) => $q
                ->where('shift_date', $today)
                ->where('status', '!=', 'cancelled'),
            ])
            ->get()
            ->map(fn($b) => [
                'id'              => $b->id,
                'name'            => $b->name,
                'slug'            => $b->slug,
                'photo_url'       => $b->photo_url,
                'signature_color' => $b->signature_color?->value,
                'has_shift_today' => $b->shifts->isNotEmpty(),
            ]);

        return $this->ok('OK', $barbers);
    }
}
