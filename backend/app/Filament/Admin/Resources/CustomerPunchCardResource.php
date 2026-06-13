<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\CustomerPunchCardResource\Pages;
use App\Models\CustomerPunchCard;
use App\Models\PunchCardHistory;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class CustomerPunchCardResource extends Resource
{
    protected static ?string $model = CustomerPunchCard::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-gift';
    protected static ?string $navigationLabel = 'Loyalty Cards';
    protected static ?string $modelLabel = 'Loyalty Card';
    protected static \UnitEnum|string|null $navigationGroup = 'Keuangan';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Pelanggan')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('customer.phone')
                    ->label('No. HP')
                    ->searchable(),
                Tables\Columns\TextColumn::make('punch_count')
                    ->label('Punch Saat Ini')
                    ->formatStateUsing(fn($state) => "{$state} / 10"),
                Tables\Columns\TextColumn::make('lifetime_punch_count')
                    ->label('Total Lifetime')
                    ->sortable(),
                Tables\Columns\TextColumn::make('last_punched_at')
                    ->label('Terakhir Punch')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('last_rewarded_at')
                    ->label('Terakhir Reward')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\Action::make('manual_adjust')
                    ->label('Adjust Manual')
                    ->icon('heroicon-o-pencil-square')
                    ->color('warning')
                    ->form([
                        TextInput::make('adjustment')
                            ->label('Jumlah Punch (+/-)')
                            ->integer()
                            ->required()
                            ->helperText('Gunakan angka negatif untuk mengurangi.'),
                        TextInput::make('note')
                            ->label('Alasan')
                            ->required()
                            ->maxLength(255),
                    ])
                    ->action(function ($record, array $data): void {
                        $adjustment = (int) $data['adjustment'];

                        $record->punch_count      = max(0, $record->punch_count + $adjustment);
                        $record->lifetime_punch_count = max(0, $record->lifetime_punch_count + max(0, $adjustment));
                        $record->save();

                        PunchCardHistory::create([
                            'customer_user_id'  => $record->customer_user_id,
                            'booking_id'        => null,
                            'action'            => 'manual_adjust',
                            'punch_count_after' => $record->punch_count,
                            'note'              => $data['note'],
                        ]);

                        Notification::make()
                            ->title('Punch card disesuaikan.')
                            ->success()
                            ->send();
                    }),
            ])
            ->defaultSort('last_punched_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCustomerPunchCards::route('/'),
        ];
    }
}
