<?php

namespace App\Filament\Kasir\Resources;

use App\Filament\Kasir\Resources\ReceiptResource\Pages;
use App\Models\Receipt;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ReceiptResource extends Resource
{
    protected static ?string $model = Receipt::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-receipt-percent';
    protected static ?string $navigationLabel = 'Transaksi';
    protected static ?string $modelLabel = 'Transaksi';
    protected static ?int $navigationSort = 6;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('branch_id', auth()->user()->branch_id);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn(Builder $query) => $query->with('booking:id,customer_name'))
            ->columns([
                Tables\Columns\TextColumn::make('receipt_number')
                    ->label('No. Struk')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Waktu')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('type')
                    ->label('Jenis')
                    ->badge()
                    ->getStateUsing(fn(Receipt $record) => $record->booking_id ? 'Layanan' : 'Produk')
                    ->color(fn($state) => $state === 'Layanan' ? 'primary' : 'success'),
                Tables\Columns\TextColumn::make('booking.customer_name')
                    ->label('Pelanggan')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('total')
                    ->label('Total')
                    ->money('IDR')
                    ->sortable()
                    ->summarize(Sum::make()->label('Total')->money('IDR')),
                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Metode')
                    ->badge()
                    ->formatStateUsing(fn($state) => match ($state->value ?? $state) {
                        'cash'          => 'Cash',
                        'bank_transfer' => 'Transfer Bank',
                        'qris_external' => 'QRIS',
                        default         => $state,
                    }),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\Filter::make('type')
                    ->form([
                        Select::make('type')
                            ->label('Jenis')
                            ->options(['booking' => 'Layanan', 'product' => 'Produk'])
                            ->placeholder('Semua'),
                    ])
                    ->query(fn(Builder $query, array $data) => $query
                        ->when(($data['type'] ?? null) === 'booking', fn($q) => $q->whereNotNull('booking_id'))
                        ->when(($data['type'] ?? null) === 'product', fn($q) => $q->whereNull('booking_id'))),
                Tables\Filters\SelectFilter::make('payment_method')
                    ->label('Metode')
                    ->options([
                        'cash'          => 'Cash',
                        'bank_transfer' => 'Transfer Bank',
                        'qris_external' => 'QRIS',
                    ]),
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        DatePicker::make('from')->label('Dari tanggal'),
                        DatePicker::make('until')->label('Sampai tanggal'),
                    ])
                    ->query(fn(Builder $query, array $data) => $query
                        ->when($data['from'] ?? null, fn($q, $date) => $q->whereDate('created_at', '>=', $date))
                        ->when($data['until'] ?? null, fn($q, $date) => $q->whereDate('created_at', '<=', $date))),
            ])
            ->actions([
                Actions\Action::make('lihat')
                    ->label('Lihat Struk')
                    ->icon('heroicon-o-eye')
                    ->url(fn(Receipt $record) => route('receipt.show', $record))
                    ->openUrlInNewTab(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReceipts::route('/'),
        ];
    }
}
