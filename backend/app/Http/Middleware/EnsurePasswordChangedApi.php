<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChangedApi
{
    /**
     * Blokir endpoint terproteksi selama akun masih wajib ganti password.
     * Klien memakai flag `force_password_change` untuk mengarahkan pengguna
     * ke layar ganti password (endpoint POST /auth/change-password).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->force_password_change) {
            return response()->json([
                'status'                => false,
                'message'               => 'Anda wajib mengganti password terlebih dahulu.',
                'force_password_change' => true,
            ], 403);
        }

        return $next($request);
    }
}
