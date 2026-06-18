<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class BranchController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $branches = Branch::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'address', 'city', 'phone', 'latitude', 'longitude', 'opening_time', 'closing_time', 'google_maps_url', 'image_path', 'qris_image_path'])
            ->map(fn($b) => [
                'id'              => $b->id,
                'name'            => $b->name,
                'slug'            => $b->slug,
                'address'         => $b->address,
                'city'            => $b->city,
                'phone'           => $b->phone,
                'latitude'        => $b->latitude !== null ? (float) $b->latitude : null,
                'longitude'       => $b->longitude !== null ? (float) $b->longitude : null,
                'opening_time'    => $b->opening_time,
                'closing_time'    => $b->closing_time,
                'google_maps_url' => $b->google_maps_url,
                'image_url'       => $b->image_path
                    ? \Illuminate\Support\Facades\Storage::disk('public')->url($b->image_path)
                    : null,
                'qris_image_url'  => $b->qris_image_path
                    ? \Illuminate\Support\Facades\Storage::disk('public')->url($b->qris_image_path)
                    : null,
            ]);

        return $this->ok('OK', $branches);
    }

    public function show(string $slug): JsonResponse
    {
        $branch = Branch::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'bankAccounts'  => fn($q) => $q->where('is_active', true)->orderBy('sort_order'),
                'servicePrices' => fn($q) => $q->where('is_active', true)
                    ->with('service:id,name,description,duration_minutes,sort_order'),
            ])
            ->first();

        if (! $branch) {
            return $this->error('Cabang tidak ditemukan.', 404);
        }

        return $this->ok('OK', [
            'id'              => $branch->id,
            'name'            => $branch->name,
            'slug'            => $branch->slug,
            'address'         => $branch->address,
            'city'            => $branch->city,
            'phone'           => $branch->phone,
            'opening_time'    => $branch->opening_time,
            'closing_time'    => $branch->closing_time,
            'google_maps_url' => $branch->google_maps_url,
            'qris_image_url'  => $branch->qris_image_path
                ? \Illuminate\Support\Facades\Storage::disk('public')->url($branch->qris_image_path)
                : null,
            'bank_accounts'   => $branch->bankAccounts->map(fn($b) => [
                'bank_name'      => $b->bank_name,
                'account_number' => $b->account_number,
                'account_holder' => $b->account_holder,
            ]),
            'services' => $branch->servicePrices
                ->sortBy(fn($sp) => $sp->service->sort_order)
                ->values()
                ->map(fn($sp) => [
                    'id'               => $sp->service->id,
                    'name'             => $sp->service->name,
                    'description'      => $sp->service->description,
                    'duration_minutes' => $sp->service->duration_minutes,
                    'price'            => (float) $sp->price,
                ]),
        ]);
    }
}
