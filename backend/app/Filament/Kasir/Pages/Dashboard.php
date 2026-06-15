<?php

namespace App\Filament\Kasir\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $navigationLabel = 'Dashboard';
    protected static ?string $title = 'Dashboard Kasir';
    protected string $view = 'filament.kasir.pages.dashboard';
}
