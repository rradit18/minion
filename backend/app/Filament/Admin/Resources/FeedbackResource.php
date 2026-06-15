<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\FeedbackResource\Pages;
use App\Models\Branch;
use App\Models\Feedback;
use Filament\Actions;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class FeedbackResource extends Resource
{
    protected static ?string $model = Feedback::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-chat-bubble-left-ellipsis';
    protected static ?string $navigationLabel = 'Feedback';
    protected static ?string $modelLabel = 'Feedback';
    protected static \UnitEnum|string|null $navigationGroup = 'Laporan';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Placeholder::make('branch_name')
                ->label('Cabang')
                ->content(fn($record) => $record?->branch?->name ?? '-'),
            TextInput::make('customer_name')
                ->label('Nama Pelanggan')
                ->placeholder('Anonim')
                ->disabled(),
            TextInput::make('customer_phone')
                ->label('No. Telepon')
                ->placeholder('-')
                ->disabled(),
            Placeholder::make('stars')
                ->label('Rating')
                ->content(fn($record) => $record
                    ? str_repeat('★', $record->stars) . str_repeat('☆', 5 - $record->stars)
                    : '-'),
            Placeholder::make('category')
                ->label('Kategori')
                ->content(fn($record) => $record ? ucfirst($record->category->value) : '-'),
            Textarea::make('message')
                ->label('Pesan')
                ->disabled()
                ->rows(4),
            Placeholder::make('created_at')
                ->label('Dikirim pada')
                ->content(fn($record) => $record?->created_at?->translatedFormat('d M Y H:i')),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('branch.name')
                    ->label('Cabang')
                    ->sortable()
                    ->placeholder('Semua'),
                Tables\Columns\TextColumn::make('stars')
                    ->label('Bintang')
                    ->badge()
                    ->formatStateUsing(fn($state) => str_repeat('★', $state) . str_repeat('☆', 5 - $state))
                    ->color(fn($state) => match (true) {
                        $state >= 4 => 'success',
                        $state === 3 => 'warning',
                        default     => 'danger',
                    }),
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->formatStateUsing(fn($state) => ucfirst($state->value ?? $state)),
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Nama')
                    ->placeholder('Anonim'),
                Tables\Columns\TextColumn::make('message')
                    ->label('Pesan')
                    ->limit(60)
                    ->tooltip(fn($record) => $record->message),
                Tables\Columns\IconColumn::make('is_read')
                    ->label('Dibaca')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('branch_id')
                    ->label('Cabang')
                    ->options(Branch::pluck('name', 'id')),
                Tables\Filters\SelectFilter::make('stars')
                    ->label('Rating')
                    ->options([1 => '1★', 2 => '2★', 3 => '3★', 4 => '4★', 5 => '5★']),
                Tables\Filters\TernaryFilter::make('is_read')->label('Status Baca'),
            ])
            ->actions([
                Actions\Action::make('toggle_read')
                    ->label(fn($record) => $record->is_read ? 'Tandai Belum Dibaca' : 'Tandai Dibaca')
                    ->icon(fn($record) => $record->is_read ? 'heroicon-o-envelope' : 'heroicon-o-envelope-open')
                    ->action(function ($record): void {
                        $record->update(['is_read' => ! $record->is_read]);
                        Notification::make()
                            ->title($record->is_read ? 'Ditandai sudah dibaca.' : 'Ditandai belum dibaca.')
                            ->success()
                            ->send();
                    }),
                Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\BulkAction::make('mark_read')
                        ->label('Tandai Sudah Dibaca')
                        ->icon('heroicon-o-envelope-open')
                        ->action(fn($records) => $records->each->update(['is_read' => true]))
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFeedbacks::route('/'),
        ];
    }
}
