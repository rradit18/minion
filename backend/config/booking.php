<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Payment window (menit)
    |--------------------------------------------------------------------------
    | Lama slot ditahan untuk customer setelah keep slot, menunggu pembayaran.
    | Lewat batas ini tanpa upload bukti, slot dilepas (booking expired).
    */
    'payment_window' => (int) env('BOOKING_PAYMENT_WINDOW', 10),
];
