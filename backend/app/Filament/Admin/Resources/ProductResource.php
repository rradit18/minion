<?php

namespace App\Filament\Admin\Resources;

use App\Enums\ProductCategory;
use App\Filament\Admin\Resources\ProductResource\Pages;
use App\Models\Branch;
use App\Models\Product;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-shopping-bag';
    protected static ?string $navigationLabel = 'Produk';
    protected static ?string $modelLabel = 'Produk';
    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Grid::make(['default' => 1, 'lg' => 5])->schema([
                Section::make()->schema([
                    TextInput::make('name')
                        ->label('Nama Produk')
                        ->required()
                        ->maxLength(255),
                    Textarea::make('description')
                        ->label('Deskripsi')
                        ->rows(2)
                        ->placeholder('Deskripsi singkat produk untuk halaman website'),
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
                        ->minValue(0)
                        ->default(5),
                    Select::make('branch_id')
                        ->label('Cabang (Opsional)')
                        ->options(Branch::where('is_active', true)->pluck('name', 'id'))
                        ->searchable()
                        ->nullable()
                        ->helperText('Kosongkan jika produk tersedia di semua cabang.'),
                ])->columnSpan(['default' => 1, 'lg' => 3]),

                Section::make()->schema([
                    FileUpload::make('image_path')
                        ->label('Foto Produk')
                        ->image()
                        ->disk('public')
                        ->directory('products')
                        ->imageEditor(),
                    Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),
                    Toggle::make('best_seller')
                        ->label('Best Seller')
                        ->default(false),
                ])->columnSpan(['default' => 1, 'lg' => 2]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Foto')
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
                Tables\Columns\IconColumn::make('best_seller')
                    ->label('Best Seller')
                    ->boolean()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('branch.name')
                    ->label('Cabang')
                    ->placeholder('Semua Cabang')
                    ->sortable()
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
                Tables\Filters\TernaryFilter::make('best_seller')->label('Best Seller'),
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
