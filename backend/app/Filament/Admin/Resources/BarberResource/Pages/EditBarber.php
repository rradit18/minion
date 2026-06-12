<?php

namespace App\Filament\Admin\Resources\BarberResource\Pages;

use App\Filament\Admin\Resources\BarberResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditBarber extends EditRecord
{
    protected static string $resource = BarberResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}
