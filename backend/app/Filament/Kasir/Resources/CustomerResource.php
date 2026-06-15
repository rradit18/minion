<?php

namespace App\Filament\Kasir\Resources;

use App\Enums\UserRole;
use App\Filament\Kasir\Resources\CustomerResource\Pages;
use App\Models\User;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class CustomerResource extends Resource
{
    protected static ?string $model = User::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-user-plus';
    protected static ?string $navigationLabel = 'Pelanggan';
    protected static ?string $modelLabel = 'Pelanggan';
    protected static ?int $navigationSort = 3;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('role', UserRole::Customer->value);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('name')
                ->label('Nama')
                ->required()
                ->maxLength(255),
            TextInput::make('phone')
                ->label('Nomor HP')
                ->required()
                ->maxLength(20)
                ->unique(User::class, 'phone', ignoreRecord: true),
            TextInput::make('email')
                ->label('Email (opsional)')
                ->email()
                ->unique(User::class, 'email', ignoreRecord: true),
            TextInput::make('password')
                ->label('Password Default')
                ->password()
                ->revealable()
                ->default('minion123')
                ->helperText('Beri tahu password ini ke pelanggan. Ia wajib menggantinya saat login pertama.')
                ->dehydrateStateUsing(fn($state) => Hash::make($state))
                ->dehydrated(fn($state) => filled($state))
                ->required(fn(string $operation) => $operation === 'create'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn(Builder $query) => $query->with('punchCard'))
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->label('No. HP')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->placeholder('-')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('punchCard.punch_count')
                    ->label('Stempel')
                    ->badge()
                    ->placeholder('0'),
                Tables\Columns\IconColumn::make('force_password_change')
                    ->label('Belum Reset')
                    ->boolean()
                    ->trueIcon('heroicon-o-exclamation-triangle')
                    ->falseIcon('heroicon-o-check-circle')
                    ->trueColor('warning')
                    ->falseColor('success'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Terdaftar')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListCustomers::route('/'),
            'create' => Pages\CreateCustomer::route('/create'),
            'edit'   => Pages\EditCustomer::route('/{record}/edit'),
        ];
    }
}
