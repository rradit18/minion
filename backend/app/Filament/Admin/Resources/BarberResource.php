<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\BarberResource\Pages;
use App\Models\Barber;
use App\Models\User;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class BarberResource extends Resource
{
    protected static ?string $model = Barber::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-scissors';
    protected static ?string $navigationLabel = 'Barber';
    protected static ?string $modelLabel = 'Barber';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Grid::make(3)->schema([
                Section::make()->schema([
                    Select::make('user_id')
                        ->label('Akun User')
                        ->options(User::where('role', 'barber')->pluck('name', 'id'))
                        ->searchable()
                        ->nullable(),
                    TextInput::make('name')
                        ->label('Nama')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn($state, $set) => $set('slug', Str::slug($state))),
                    TextInput::make('slug')
                        ->label('Slug')
                        ->required()
                        ->unique(Barber::class, 'slug', ignoreRecord: true),
                    TextInput::make('tagline')
                        ->label('Tagline')
                        ->maxLength(255),
                    Textarea::make('bio')
                        ->label('Bio')
                        ->rows(3),
                    TagsInput::make('specializations')
                        ->label('Spesialisasi'),
                    TextInput::make('instagram')
                        ->label('Instagram')
                        ->prefix('@'),
                    TextInput::make('tiktok')
                        ->label('TikTok')
                        ->prefix('@'),
                    Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),
                ])->columnSpan(2),

                Section::make()->schema([
                    FileUpload::make('photo_url')
                        ->label('Foto')
                        ->image()
                        ->avatar()
                        ->imageEditor(),
                    Radio::make('signature_color')
                        ->label('Warna Signature')
                        ->options([
                            'teal'   => 'Teal',
                            'coral'  => 'Coral',
                            'violet' => 'Violet',
                            'yellow' => 'Yellow',
                        ])
                        ->required(),
                    CheckboxList::make('branches')
                        ->label('Cabang')
                        ->relationship('branches', 'name')
                        ->bulkToggleable(),
                ])->columnSpan(1),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo_url')
                    ->label('Foto')
                    ->circular(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('signature_color')
                    ->label('Warna')
                    ->badge(),
                Tables\Columns\TextColumn::make('branches.name')
                    ->label('Cabang')
                    ->badge()
                    ->separator(','),
                Tables\Columns\TextColumn::make('avg_rating')
                    ->label('Rating')
                    ->getStateUsing(fn($record) => $record->avg_rating
                        ? number_format($record->avg_rating, 1) . ' ★'
                        : '-'),
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

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListBarbers::route('/'),
            'create' => Pages\CreateBarber::route('/create'),
            'edit'   => Pages\EditBarber::route('/{record}/edit'),
        ];
    }
}
