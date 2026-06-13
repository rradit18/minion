<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\PromoResource\Pages;
use App\Models\Promo;
use App\Models\Service;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PromoResource extends Resource
{
    protected static ?string $model = Promo::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-tag';
    protected static ?string $navigationLabel = 'Promo';
    protected static ?string $modelLabel = 'Promo';
    protected static \UnitEnum|string|null $navigationGroup = 'Keuangan';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Grid::make(2)->schema([
                TextInput::make('code')
                    ->label('Kode Promo')
                    ->required()
                    ->maxLength(50)
                    ->unique(Promo::class, 'code', ignoreRecord: true)
                    ->suffixAction(
                        \Filament\Forms\Components\Actions\Action::make('generate')
                            ->label('Auto')
                            ->icon('heroicon-o-arrow-path')
                            ->action(fn($set) => $set('code', strtoupper(Str::random(8))))
                    ),
                TextInput::make('name')
                    ->label('Nama Promo')
                    ->required()
                    ->maxLength(255),
            ]),

            Textarea::make('description')->label('Deskripsi')->rows(2)->columnSpanFull(),

            Grid::make(3)->schema([
                Select::make('discount_type')
                    ->label('Tipe Diskon')
                    ->options([
                        'percentage'   => 'Persentase (%)',
                        'fixed_amount' => 'Nominal Tetap (Rp)',
                        'free_service' => 'Layanan Gratis',
                    ])
                    ->required()
                    ->live(),

                TextInput::make('discount_value')
                    ->label('Nilai Diskon')
                    ->numeric()
                    ->minValue(0)
                    ->visible(fn(Get $get) => in_array($get('discount_type'), ['percentage', 'fixed_amount']))
                    ->suffix(fn(Get $get) => $get('discount_type') === 'percentage' ? '%' : 'Rp'),

                Select::make('free_service_id')
                    ->label('Layanan Gratis')
                    ->options(Service::where('is_active', true)->pluck('name', 'id'))
                    ->visible(fn(Get $get) => $get('discount_type') === 'free_service')
                    ->searchable(),
            ]),

            Grid::make(3)->schema([
                TextInput::make('min_order')
                    ->label('Minimum Order (Rp)')
                    ->numeric()
                    ->minValue(0)
                    ->prefix('Rp'),
                TextInput::make('max_uses')
                    ->label('Maks. Pemakaian Total')
                    ->numeric()
                    ->minValue(1)
                    ->placeholder('Tidak terbatas'),
                TextInput::make('max_uses_per_user')
                    ->label('Maks. per User')
                    ->numeric()
                    ->minValue(1)
                    ->placeholder('Tidak terbatas'),
            ]),

            Grid::make(2)->schema([
                DatePicker::make('valid_from')->label('Berlaku Dari')->required(),
                DatePicker::make('valid_until')->label('Berlaku Hingga')->required(),
            ]),

            Select::make('required_role')
                ->label('Untuk')
                ->options(['all' => 'Semua Pelanggan', 'registered_only' => 'Member Terdaftar'])
                ->required()
                ->default('all'),

            CheckboxList::make('branches')
                ->label('Berlaku di Cabang (kosongkan = semua)')
                ->relationship('branches', 'name')
                ->columnSpanFull(),

            Toggle::make('is_active')->label('Aktif')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Kode')
                    ->badge()
                    ->color('warning')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')->label('Nama')->searchable(),
                Tables\Columns\TextColumn::make('discount_type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn($state) => match ($state->value ?? $state) {
                        'percentage'   => 'info',
                        'fixed_amount' => 'success',
                        'free_service' => 'danger',
                        default        => 'gray',
                    }),
                Tables\Columns\TextColumn::make('valid_until')->label('Hingga')->date('d M Y'),
                Tables\Columns\TextColumn::make('used_count')->label('Dipakai'),
                Tables\Columns\IconColumn::make('is_active')->label('Aktif')->boolean(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')->label('Status'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListPromos::route('/'),
            'create' => Pages\CreatePromo::route('/create'),
            'edit'   => Pages\EditPromo::route('/{record}/edit'),
        ];
    }
}
