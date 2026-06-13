<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Illuminate\Http\Response;

class ReceiptController extends Controller
{
    public function show(string $receiptId): Response|\Illuminate\Contracts\View\View
    {
        $receipt = Receipt::with([
            'items',
            'booking.barber:id,name',
            'booking.branch:id,name,phone',
            'branch:id,name,phone',
            'kasir:id,name',
        ])->findOrFail($receiptId);

        return view('receipt', compact('receipt'));
    }
}
