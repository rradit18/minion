<?php

use App\Http\Controllers\ReceiptController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => redirect('/admin-panel'));

Route::get('/receipt/{receiptId}', [ReceiptController::class, 'show'])
    ->name('receipt.show');
