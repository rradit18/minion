<?php

namespace App\Filament\Kasir\Resources\ProductResource\Pages;

use App\Filament\Kasir\Resources\ProductResource;
use Filament\Resources\Pages\CreateRecord;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['branch_id'] = auth()->user()->branch_id;

        return $data;
    }
}
