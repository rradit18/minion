<?php

namespace App\Providers\Filament;

use App\Filament\Kasir\Pages\Dashboard;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class KasirPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('kasir')
            ->path('kasir-panel')
            ->login()
            ->darkMode(true)
            ->colors([
                'primary' => Color::hex('#C9A544'),
            ])
            ->renderHook('panels::head.end', fn () => app(\Illuminate\Foundation\Vite::class)('resources/css/app.css'))
            ->discoverResources(in: app_path('Filament/Kasir/Resources'), for: 'App\\Filament\\Kasir\\Resources')
            ->discoverPages(in: app_path('Filament/Kasir/Pages'), for: 'App\\Filament\\Kasir\\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Kasir/Widgets'), for: 'App\\Filament\\Kasir\\Widgets')
            ->widgets([
                AccountWidget::class,
            ])
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
                \App\Http\Middleware\EnsureRole::class . ':cashier',
                \App\Http\Middleware\EnsurePasswordChanged::class,
            ]);
    }
}
