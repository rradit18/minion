<?php

namespace App\Filament\Admin\Resources\BranchResource\RelationManagers;

use App\Models\Service;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class ServicePricesRelationManager extends RelationManager
{
    protected static string $relationship = 'servicePrices';
    protected static ?string $title = 'Harga Layanan';

    public function form(Schema $schema): Schema
    {
        return $schema->schema([
            Select::make('service_id')
                ->label('Layanan')
                ->options(Service::where('is_active', true)->orderBy('sort_order')->pluck('name', 'id'))
                ->required()
                ->searchable(),
            TextInput::make('price')
                ->label('Harga (Rp)')
                ->numeric()
                ->required()
                ->minValue(0)
                ->prefix('Rp'),
            Toggle::make('is_active')
                ->label('Aktif')
                ->default(true),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('service.name')
            ->columns([
                Tables\Columns\TextColumn::make('service.name')
                    ->label('Layanan')
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
            ])
            ->headerActions([
                Actions\CreateAction::make(),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ]);
    }
}
