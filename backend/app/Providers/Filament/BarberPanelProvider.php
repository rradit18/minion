<?php

namespace App\Providers\Filament;

use App\Filament\Barber\Pages\Dashboard;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class BarberPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('barber')
            ->path('barber-panel')
            ->login(\App\Filament\Barber\Pages\Login::class)
            ->profile()
            ->darkMode(true)
            ->sidebarCollapsibleOnDesktop()
            ->colors(['primary' => Color::hex('#C9A544')])
            ->renderHook('panels::head.end', fn () => app(\Illuminate\Foundation\Vite::class)('resources/css/app.css'))
            ->renderHook(
                'panels::simple-page.end',
                fn () => view('filament.auth.quick-login', [
                    'panelLinks' => [
                        ['label' => 'Panel Admin', 'url' => '/admin-panel'],
                        ['label' => 'Panel Kasir', 'url' => '/kasir-panel'],
                    ],
                ]),
                scopes: \App\Filament\Barber\Pages\Login::class,
            )
            ->discoverResources(in: app_path('Filament/Barber/Resources'), for: 'App\\Filament\\Barber\\Resources')
            ->discoverPages(in: app_path('Filament/Barber/Pages'), for: 'App\\Filament\\Barber\\Pages')
            ->pages([Dashboard::class])
            ->discoverWidgets(in: app_path('Filament/Barber/Widgets'), for: 'App\\Filament\\Barber\\Widgets')
            ->widgets([])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
                \App\Http\Middleware\EnsureRole::class . ':barber',
                \App\Http\Middleware\EnsurePasswordChangedBarber::class,
            ]);
    }
}
