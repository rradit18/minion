<?php

namespace App\Filament\Kasir\Pages;

use Filament\Pages\Page;

class ShiftSchedule extends Page
{
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-clock';

    protected static ?string $navigationLabel = 'Jadwal Shift';

    protected static ?string $title = 'Jadwal Shift Barber';

    protected static ?int $navigationSort = 5;

    protected string $view = 'filament.kasir.pages.shift-schedule';
}
