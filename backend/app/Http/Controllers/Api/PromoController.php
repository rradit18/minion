<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PromoService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    use ApiResponse;

    public function __construct(private PromoService $promoService) {}

    public function validate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code'      => 'required|string',
            'subtotal'  => 'required|numeric|min:0',
            'branch_id' => 'required|uuid|exists:branches,id',
        ]);

        // Optional auth — customer may or may not be logged in
        $customer = $request->user();
        if ($customer && ! ($customer instanceof User)) {
            $customer = null;
        }

        try {
            $result = $this->promoService->validate(
                $validated['code'],
                (float) $validated['subtotal'],
                $validated['branch_id'],
                $customer,
            );

            return $this->ok('Promo valid.', [
                'valid'           => true,
                'discount_amount' => $result['discount'],
                'promo'           => [
                    'id'             => $result['promo']->id,
                    'code'           => $result['promo']->code,
                    'name'           => $result['promo']->name,
                    'discount_type'  => $result['promo']->discount_type->value,
                    'discount_value' => $result['promo']->discount_value,
                ],
            ]);
        } catch (\RuntimeException $e) {
            $status = $e->getCode() ?: 422;
            return $this->error($e->getMessage(), $status);
        }
    }
}
