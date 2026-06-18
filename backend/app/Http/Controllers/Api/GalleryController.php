<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class GalleryController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $images = Gallery::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($g) => [
                'id'        => $g->id,
                'title'     => $g->title,
                'image_url' => $g->image_url,
            ]);

        return $this->ok('OK', $images);
    }
}
