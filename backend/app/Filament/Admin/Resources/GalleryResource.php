<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\GalleryResource\Pages;
use App\Models\Gallery;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class GalleryResource extends Resource
{
    protected static ?string $model = Gallery::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationLabel = 'Gallery';
    protected static ?string $modelLabel = 'Foto Gallery';
    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            FileUpload::make('image_path')
                ->label('Foto')
                ->image()
                ->disk('public')
                ->directory('gallery')
                ->imageEditor()
                ->required()
                ->columnSpanFull(),
            TextInput::make('title')
                ->label('Judul / Keterangan')
                ->maxLength(255)
                ->placeholder('Opsional'),
            TextInput::make('sort_order')
                ->label('Urutan')
                ->numeric()
                ->default(0),
            Toggle::make('is_active')
                ->label('Tampilkan')
                ->default(true),
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
                    ->size(80),
                Tables\Columns\TextColumn::make('title')
                    ->label('Judul')
                    ->placeholder('—')
                    ->searchable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Tampil')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ditambahkan')
                    ->date('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')->label('Status'),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
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
            'index'  => Pages\ListGalleries::route('/'),
            'create' => Pages\CreateGallery::route('/create'),
            'edit'   => Pages\EditGallery::route('/{record}/edit'),
        ];
    }
}
