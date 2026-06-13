<?php

namespace App\Filament\Kasir\Resources;

use App\Enums\ProductCategory;
use App\Filament\Kasir\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-shopping-bag';
    protected static ?string $navigationLabel = 'Produk';
    protected static ?string $modelLabel = 'Produk';
    protected static ?int $navigationSort = 4;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('branch_id', auth()->user()->branch_id);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('name')
                ->label('Nama Produk')
                ->required()
                ->maxLength(255),
            FileUpload::make('image_path')
                ->label('Gambar Produk')
                ->image()
                ->disk('public')
                ->directory('products')
                ->imageEditor()
                ->columnSpanFull(),
            Select::make('category')
                ->label('Kategori')
                ->options(ProductCategory::options())
                ->required(),
            TextInput::make('sku')
                ->label('SKU')
                ->maxLength(255),
            TextInput::make('price')
                ->label('Harga (Rp)')
                ->numeric()
                ->required()
                ->minValue(0)
                ->prefix('Rp'),
            TextInput::make('stock_qty')
                ->label('Stok')
                ->numeric()
                ->required()
                ->minValue(0)
                ->default(0),
            TextInput::make('low_stock_threshold')
                ->label('Ambang Stok Menipis')
                ->numeric()
                ->required()
                ->minValue(0)
                ->default(5),
            Toggle::make('is_active')
                ->label('Aktif')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Gambar')
                    ->disk('public')
                    ->square()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->formatStateUsing(fn($state) => $state?->label())
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('sku')
                    ->label('SKU')
                    ->placeholder('-')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('stock_qty')
                    ->label('Stok')
                    ->badge()
                    ->color(fn($record) => $record->isLowStock() ? 'danger' : 'success')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
            ])
            ->defaultSort('name')
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->label('Kategori')
                    ->options(ProductCategory::options()),
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
            'index'  => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit'   => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
