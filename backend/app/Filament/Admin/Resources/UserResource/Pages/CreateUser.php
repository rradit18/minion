<?php

namespace App\Filament\Admin\Resources\UserResource\Pages;

use App\Filament\Admin\Resources\UserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    /**
     * Akun staf (kasir/barber) dibuatkan oleh admin dengan password awal,
     * sehingga wajib diganti sendiri oleh pengguna saat login pertama.
     */
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (in_array($data['role'] ?? null, ['cashier', 'barber'], true)) {
            $data['force_password_change'] = true;
        }

        return $data;
    }
}
