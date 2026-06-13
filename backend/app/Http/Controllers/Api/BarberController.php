<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barber;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BarberController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Barber::where('is_active', true)
            ->with('branches:id,name,slug');

        if ($request->filled('branch_id')) {
            $query->whereHas('branches', fn($q) => $q->where('branches.id', $request->branch_id));
        }

        $barbers = $query->get()->map(fn($b) => [
            'id'              => $b->id,
            'name'            => $b->name,
            'slug'            => $b->slug,
            'photo_url'       => $b->photo_url,
            'tagline'         => $b->tagline,
            'signature_color' => $b->signature_color?->value,
            'avg_rating'      => round((float) $b->avg_rating, 1),
            'branches'        => $b->branches->map(fn($br) => [
                'id'   => $br->id,
                'name' => $br->name,
                'slug' => $br->slug,
            ]),
        ]);

        return $this->ok('OK', $barbers);
    }

    public function show(string $slug): JsonResponse
    {
        $barber = Barber::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'branches:id,name,slug',
                'ratings' => fn($q) => $q->latest()->limit(10)->with('customer:id,name'),
            ])
            ->first();

        if (! $barber) {
            return $this->error('Barber tidak ditemukan.', 404);
        }

        $stats = $barber->ratings()->selectRaw('COUNT(*) as total, AVG(stars) as avg')->first();
        $distribution = $barber->ratings()
            ->selectRaw('stars, COUNT(*) as count')
            ->groupBy('stars')
            ->pluck('count', 'stars');

        return $this->ok('OK', [
            'id'              => $barber->id,
            'name'            => $barber->name,
            'slug'            => $barber->slug,
            'photo_url'       => $barber->photo_url,
            'bio'             => $barber->bio,
            'tagline'         => $barber->tagline,
            'signature_color' => $barber->signature_color?->value,
            'specializations' => $barber->specializations,
            'instagram'       => $barber->instagram,
            'tiktok'          => $barber->tiktok,
            'branches'        => $barber->branches->map(fn($br) => [
                'id'   => $br->id,
                'name' => $br->name,
                'slug' => $br->slug,
            ]),
            'rating' => [
                'avg'   => round((float) $stats->avg, 1),
                'total' => (int) $stats->total,
                'distribution' => [
                    '5' => (int) ($distribution[5] ?? 0),
                    '4' => (int) ($distribution[4] ?? 0),
                    '3' => (int) ($distribution[3] ?? 0),
                    '2' => (int) ($distribution[2] ?? 0),
                    '1' => (int) ($distribution[1] ?? 0),
                ],
            ],
            'recent_reviews' => $barber->ratings->map(fn($r) => [
                'stars'      => $r->stars,
                'comment'    => $r->comment,
                'reviewer'   => $r->is_anonymous ? 'Anonim' : ($r->customer?->name ?? 'Pelanggan'),
                'created_at' => $r->created_at->toIso8601String(),
            ]),
        ]);
    }
}
