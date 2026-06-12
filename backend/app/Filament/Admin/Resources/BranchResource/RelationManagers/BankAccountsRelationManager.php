<?php

namespace App\Filament\Admin\Resources\BranchResource\RelationManagers;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class BankAccountsRelationManager extends RelationManager
{
    protected static string $relationship = 'bankAccounts';
    protected static ?string $title = 'Rekening Bank';

    public function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('bank_name')
                ->label('Nama Bank')
                ->required()
                ->maxLength(100),
            TextInput::make('account_number')
                ->label('Nomor Rekening')
                ->required()
                ->maxLength(50),
            TextInput::make('account_holder')
                ->label('Nama Pemilik')
                ->required()
                ->maxLength(255),
            TextInput::make('sort_order')
                ->label('Urutan')
                ->numeric()
                ->default(0),
            Toggle::make('is_active')
                ->label('Aktif')
                ->default(true),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('bank_name')
            ->columns([
                Tables\Columns\TextColumn::make('bank_name')->label('Bank'),
                Tables\Columns\TextColumn::make('account_number')->label('No. Rekening'),
                Tables\Columns\TextColumn::make('account_holder')->label('Pemilik'),
                Tables\Columns\TextColumn::make('sort_order')->label('Urutan')->sortable(),
                Tables\Columns\IconColumn::make('is_active')->label('Aktif')->boolean(),
            ])
            ->reorderable('sort_order')
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
