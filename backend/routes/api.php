<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\BarberController;
use App\Http\Controllers\Api\BarberPortalController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\BookingPaymentController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\PromoController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

// ─── Auth ──────────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout',          [AuthController::class, 'logout']);
        Route::get('/me',               [AuthController::class, 'me']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});

// ─── Public ────────────────────────────────────────────────────────────────
Route::get('/branches',                    [BranchController::class, 'index']);
Route::get('/branches/{slug}',             [BranchController::class, 'show']);
Route::get('/branches/{branchId}/services',[ServiceController::class, 'byBranch']);
Route::get('/branches/{branchId}/barbers', [ServiceController::class, 'barbersByBranch']);

Route::get('/barbers',       [BarberController::class, 'index']);
Route::get('/barbers/{slug}',[BarberController::class, 'show']);

Route::get('/services', [ServiceController::class, 'index']);

Route::get('/availability', [AvailabilityController::class, 'index']);

Route::post('/bookings', [BookingController::class, 'store']);

Route::middleware('optional.auth')->group(function () {
    Route::post('/feedback', [FeedbackController::class, 'store']);
});
Route::get('/bookings/{bookingNumber}', [BookingController::class, 'show']);
Route::get('/bookings/{bookingNumber}/payment',       [BookingPaymentController::class, 'paymentInfo']);
Route::post('/bookings/{bookingNumber}/payment-proof', [BookingPaymentController::class, 'uploadProof']);
Route::get('/queue/{branchSlug}',       [BookingController::class, 'queue']);

// ─── Customer area [auth:sanctum + role=customer] ──────────────────────────
Route::middleware(['auth:sanctum', 'role:customer', 'password.changed'])->prefix('customer')->group(function () {
    Route::post('/bookings',                        [CustomerController::class, 'store']);
    Route::patch('/profile',                        [CustomerController::class, 'updateProfile']);
    Route::get('/bookings',                        [CustomerController::class, 'bookings']);
    Route::patch('/bookings/{id}/reschedule',      [CustomerController::class, 'reschedule']);
    Route::delete('/bookings/{id}',                [CustomerController::class, 'cancel']);
    Route::post('/bookings/{id}/rate',             [CustomerController::class, 'rate']);
    Route::get('/loyalty',                         [CustomerController::class, 'loyalty']);
    Route::get('/promos',                          [CustomerController::class, 'promos']);
});

// ─── Promo validate (public + optional auth) ───────────────────────────────
Route::middleware('optional.auth')->post('/promos/validate', [PromoController::class, 'validate']);

// ─── Barber portal [auth:sanctum + role=barber] ────────────────────────────
Route::middleware(['auth:sanctum', 'role:barber', 'password.changed'])->prefix('barber')->group(function () {
    Route::get('/schedule',       [BarberPortalController::class, 'schedule']);
    Route::get('/bookings/today', [BarberPortalController::class, 'todayBookings']);
    Route::get('/ratings',        [BarberPortalController::class, 'ratings']);
});
