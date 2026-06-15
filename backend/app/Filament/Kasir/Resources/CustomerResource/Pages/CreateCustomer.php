<?php

namespace App\Filament\Kasir\Resources\CustomerResource\Pages;

use App\Enums\UserRole;
use App\Filament\Kasir\Resources\CustomerResource;
use App\Models\CustomerPunchCard;
use Filament\Resources\Pages\CreateRecord;

class CreateCustomer extends CreateRecord
{
    protected static string $resource = CustomerResource::class;

    /**
     * Akun customer dibuatkan kasir dengan password default,
     * sehingga wajib direset sendiri saat login pertama (lihat EnsurePasswordChangedApi).
     */
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['role']                  = UserRole::Customer->value;
        $data['is_active']             = true;
        $data['force_password_change'] = true;

        return $data;
    }

    protected function afterCreate(): void
    {
        CustomerPunchCard::firstOrCreate(
            ['customer_user_id' => $this->record->id],
            ['punch_count' => 0, 'lifetime_punch_count' => 0],
        );
    }
}
