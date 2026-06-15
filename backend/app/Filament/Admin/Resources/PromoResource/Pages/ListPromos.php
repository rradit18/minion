<?php

namespace App\Filament\Admin\Resources\PromoResource\Pages;

use App\Filament\Admin\Resources\PromoResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPromos extends ListRecords
{
    protected static string $resource = PromoResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\CreateAction::make()];
    }
}
