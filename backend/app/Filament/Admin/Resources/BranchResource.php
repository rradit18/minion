<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\BranchResource\Pages;
use App\Filament\Admin\Resources\BranchResource\RelationManagers;
use App\Models\Branch;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class BranchResource extends Resource
{
    protected static ?string $model = Branch::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?string $navigationLabel = 'Cabang';
    protected static ?string $modelLabel = 'Cabang';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Tabs::make()->tabs([
                Tabs\Tab::make('Info')->schema([
                    Grid::make(2)->schema([
                        TextInput::make('name')
                            ->label('Nama Cabang')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn($state, $set) => $set('slug', Str::slug($state))),
                        TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(Branch::class, 'slug', ignoreRecord: true),
                        Textarea::make('address')
                            ->label('Alamat')
                            ->required()
                            ->columnSpanFull(),
                        TextInput::make('city')
                            ->label('Kota')
                            ->required(),
                        TextInput::make('phone')
                            ->label('Telepon')
                            ->tel(),
                        TextInput::make('latitude')
                            ->label('Latitude')
                            ->numeric(),
                        TextInput::make('longitude')
                            ->label('Longitude')
                            ->numeric(),
                        TimePicker::make('opening_time')
                            ->label('Jam Buka')
                            ->required()
                            ->seconds(false),
                        TimePicker::make('closing_time')
                            ->label('Jam Tutup')
                            ->required()
                            ->seconds(false),
                        TextInput::make('google_maps_url')
                            ->label('Google Maps URL')
                            ->url()
                            ->columnSpanFull(),
                        Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true),
                    ]),
                ]),
            ])->columnSpanFull(),
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
                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug'),
                Tables\Columns\TextColumn::make('city')
                    ->label('Kota')
                    ->sortable(),
                Tables\Columns\TextColumn::make('barbers_count')
                    ->label('Barber')
                    ->counts('barbers')
                    ->badge(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
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
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ServicePricesRelationManager::class,
            RelationManagers\BankAccountsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListBranches::route('/'),
            'create' => Pages\CreateBranch::route('/create'),
            'edit'   => Pages\EditBranch::route('/{record}/edit'),
        ];
    }
}
