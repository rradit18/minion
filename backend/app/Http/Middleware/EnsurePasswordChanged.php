<?php

namespace App\Http\Middleware;

use App\Filament\Kasir\Pages\ChangePassword;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChanged
{
    /**
     * Selama akun masih ditandai wajib ganti password, paksa pengguna ke
     * halaman ganti password sebelum bisa mengakses panel lainnya.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->force_password_change) {
            $allowed = $request->routeIs('filament.kasir.pages.change-password')
                || $request->routeIs('filament.kasir.auth.logout');

            if (! $allowed) {
                return redirect(ChangePassword::getUrl());
            }
        }

        return $next($request);
    }
}
