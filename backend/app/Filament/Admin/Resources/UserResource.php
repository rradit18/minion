<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\UserResource\Pages;
use App\Models\Branch;
use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationLabel = 'Pengguna';
    protected static ?string $modelLabel = 'Pengguna';
    protected static ?int $navigationSort = 4;

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
                ->label('Email')
                ->email()
                ->unique(User::class, 'email', ignoreRecord: true),
            Select::make('role')
                ->label('Role')
                ->options([
                    'admin'    => 'Admin',
                    'cashier'  => 'Kasir',
                    'barber'   => 'Barber',
                    'customer' => 'Customer',
                ])
                ->required()
                ->live(),
            Select::make('branch_id')
                ->label('Cabang')
                ->options(Branch::where('is_active', true)->pluck('name', 'id'))
                ->searchable()
                ->nullable()
                ->visible(fn($get) => in_array($get('role'), ['cashier', 'barber']))
                ->required(fn($get) => $get('role') === 'cashier'),
            Toggle::make('is_active')
                ->label('Aktif')
                ->default(true),
            TextInput::make('password')
                ->label('Password')
                ->password()
                ->revealable()
                ->dehydrateStateUsing(fn($state) => Hash::make($state))
                ->dehydrated(fn($state) => filled($state))
                ->required(fn(string $operation) => $operation === 'create'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
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
                    ->searchable(),
                Tables\Columns\TextColumn::make('role')
                    ->label('Role')
                    ->badge()
                    ->color(fn($state) => match ($state->value ?? $state) {
                        'admin'    => 'danger',
                        'cashier'  => 'warning',
                        'barber'   => 'primary',
                        'customer' => 'success',
                        default    => 'gray',
                    }),
                Tables\Columns\TextColumn::make('branch.name')
                    ->label('Cabang')
                    ->placeholder('-')
                    ->toggleable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Terdaftar')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->options([
                        'admin'    => 'Admin',
                        'cashier'  => 'Kasir',
                        'barber'   => 'Barber',
                        'customer' => 'Customer',
                    ]),
                Tables\Filters\TernaryFilter::make('is_active')->label('Status'),
            ])
            ->actions([
                Actions\EditAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit'   => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
