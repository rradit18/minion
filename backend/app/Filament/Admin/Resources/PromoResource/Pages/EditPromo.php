<?php

namespace App\Filament\Admin\Resources\PromoResource\Pages;

use App\Filament\Admin\Resources\PromoResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPromo extends EditRecord
{
    protected static string $resource = PromoResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}
