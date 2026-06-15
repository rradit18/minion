<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\ServiceResource\Pages;
use App\Models\Service;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-tag';
    protected static ?string $navigationLabel = 'Layanan';
    protected static ?string $modelLabel = 'Layanan';
    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('name')
                ->label('Nama Layanan')
                ->required()
                ->maxLength(255),
            Textarea::make('description')
                ->label('Deskripsi')
                ->rows(2),
            TextInput::make('duration_minutes')
                ->label('Durasi (menit)')
                ->numeric()
                ->required()
                ->minValue(1),
            TextInput::make('default_price')
                ->label('Harga Default (Rp)')
                ->numeric()
                ->required()
                ->minValue(0)
                ->prefix('Rp'),
            TextInput::make('sort_order')
                ->label('Urutan')
                ->numeric()
                ->default(0),
            Toggle::make('is_active')
                ->label('Aktif')
                ->default(true),
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
                Tables\Columns\TextColumn::make('duration_minutes')
                    ->label('Durasi')
                    ->suffix(' menit')
                    ->sortable(),
                Tables\Columns\TextColumn::make('default_price')
                    ->label('Harga Default')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->filters([
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
            'index'  => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit'   => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
