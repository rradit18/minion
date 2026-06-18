<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $products = Product::where('is_active', true)
            ->orderByDesc('best_seller')
            ->orderBy('name')
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'name'        => $p->name,
                'description' => $p->description,
                'category'    => $p->category?->value,
                'category_label' => $p->category?->label(),
                'price'       => (float) $p->price,
                'image_url'   => $p->image_path
                    ? Storage::disk('public')->url($p->image_path)
                    : null,
                'best_seller' => (bool) $p->best_seller,
            ]);

        return $this->ok('OK', $products);
    }
}
