<?php

namespace App\Http\Middleware;

use App\Filament\Barber\Pages\ChangePassword;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChangedBarber
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->force_password_change) {
            $allowed = $request->routeIs('filament.barber.pages.change-password')
                || $request->routeIs('filament.barber.auth.logout');

            if (! $allowed) {
                return redirect(ChangePassword::getUrl());
            }
        }

        return $next($request);
    }
}
