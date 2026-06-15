<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    use ApiResponse;

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'branch_id'       => 'nullable|uuid|exists:branches,id',
            'stars'           => 'required|integer|min:1|max:5',
            'category'        => 'required|string',
            'message'         => 'required|string|max:1000',
            'customer_name'   => 'nullable|string|max:255',
            'customer_phone'  => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        Feedback::create([
            'branch_id'      => $validated['branch_id'] ?? null,
            'stars'          => $validated['stars'],
            'category'       => $validated['category'],
            'message'        => $validated['message'],
            'customer_name'  => $user?->name ?? $validated['customer_name'] ?? null,
            'customer_phone' => $user?->phone ?? $validated['customer_phone'] ?? null,
            'user_id'        => $user?->id,
        ]);

        return $this->deleted('Terima kasih atas masukan kamu!');
    }
}
