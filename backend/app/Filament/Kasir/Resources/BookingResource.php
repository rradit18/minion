<?php

namespace App\Filament\Kasir\Resources;

use App\Enums\BookingStatus;
use App\Filament\Kasir\Resources\BookingResource\Pages;
use App\Models\Barber;
use App\Models\Booking;
use Filament\Forms\Components\DatePicker;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $navigationLabel = 'Booking';
    protected static ?string $modelLabel = 'Booking';
    protected static ?int $navigationSort = 1;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('branch_id', auth()->user()->branch_id);
    }

    /** Jumlah booking yang menunggu verifikasi pembayaran (perlu diproses kasir). */
    public static function getNavigationBadge(): ?string
    {
        $count = Booking::where('branch_id', auth()->user()->branch_id)
            ->where('status', BookingStatus::PendingConfirmation)
            ->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn(Builder $query) => $query->with(['barber:id,name', 'services:id,booking_id,service_name']))
            ->columns([
                Tables\Columns\TextColumn::make('booking_number')
                    ->label('No. Booking')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Pelanggan')
                    ->searchable(),
                Tables\Columns\TextColumn::make('barber.name')
                    ->label('Barber')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('services')
                    ->label('Layanan')
                    ->badge()
                    ->getStateUsing(fn(Booking $record) => $record->services->pluck('service_name')->all()),
                Tables\Columns\TextColumn::make('scheduled_at')
                    ->label('Jadwal')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn($state) => match ($state->value ?? $state) {
                        'pending_payment'      => 'gray',
                        'pending_confirmation' => 'warning',
                        'confirmed'            => 'info',
                        'in_progress'          => 'primary',
                        'completed'            => 'success',
                        'expired', 'cancelled' => 'danger',
                        default                => 'gray',
                    })
                    ->formatStateUsing(fn($state) => match ($state->value ?? $state) {
                        'pending_payment'      => 'Menunggu Pembayaran',
                        'pending_confirmation' => 'Menunggu Verifikasi',
                        'confirmed'            => 'Dikonfirmasi',
                        'in_progress'          => 'Berlangsung',
                        'completed'            => 'Selesai',
                        'expired'              => 'Kedaluwarsa',
                        'cancelled'            => 'Dibatalkan',
                        default                => $state,
                    }),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Pembayaran')
                    ->badge()
                    ->placeholder('-')
                    ->formatStateUsing(fn($state) => match ($state) {
                        'bank_transfer' => 'Transfer Bank',
                        'qris_external' => 'QRIS',
                        'cash'          => 'Cash',
                        default         => $state,
                    }),
                Tables\Columns\IconColumn::make('payment_proof_path')
                    ->label('Bukti')
                    ->boolean()
                    ->trueIcon('heroicon-o-paper-clip')
                    ->falseIcon('heroicon-o-minus')
                    ->trueColor('success')
                    ->falseColor('gray')
                    ->state(fn(Booking $record) => (bool) $record->payment_proof_path),
            ])
            ->defaultSort('scheduled_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'pending_payment'      => 'Menunggu Pembayaran',
                        'pending_confirmation' => 'Menunggu Verifikasi',
                        'confirmed'            => 'Dikonfirmasi',
                        'in_progress'          => 'Berlangsung',
                        'completed'            => 'Selesai',
                        'expired'              => 'Kedaluwarsa',
                        'cancelled'            => 'Dibatalkan',
                    ]),
                Tables\Filters\SelectFilter::make('barber_id')
                    ->label('Barber')
                    ->options(fn() => Barber::whereHas('branchAssignments', fn($q) => $q->where('branch_id', auth()->user()->branch_id))
                        ->pluck('name', 'id')),
                Tables\Filters\Filter::make('scheduled_at')
                    ->form([
                        DatePicker::make('from')->label('Dari tanggal'),
                        DatePicker::make('until')->label('Sampai tanggal'),
                    ])
                    ->query(fn(Builder $query, array $data) => $query
                        ->when($data['from'] ?? null, fn($q, $date) => $q->whereDate('scheduled_at', '>=', $date))
                        ->when($data['until'] ?? null, fn($q, $date) => $q->whereDate('scheduled_at', '<=', $date))),
            ])
            ->actions([
                Actions\Action::make('konfirmasi')
                    ->label('Verifikasi')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn(Booking $record) => $record->status === BookingStatus::PendingConfirmation)
                    ->modalHeading('Verifikasi Pembayaran')
                    ->modalSubmitActionLabel('Konfirmasi Pembayaran')
                    ->modalContent(fn(Booking $record) => view('filament.kasir.partials.payment-proof', ['booking' => $record]))
                    ->action(function (Booking $record) {
                        $record->update(['status' => BookingStatus::Confirmed, 'confirmed_at' => now()]);
                        Notification::make()->title('Booking #' . $record->booking_number . ' dikonfirmasi.')->success()->send();
                    }),
                Actions\Action::make('tolak')
                    ->label('Tolak')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->visible(fn(Booking $record) => $record->status === BookingStatus::PendingConfirmation)
                    ->requiresConfirmation()
                    ->modalHeading('Tolak Pembayaran')
                    ->modalDescription('Booking akan dibatalkan dan slot dilepas. Lanjutkan?')
                    ->action(function (Booking $record) {
                        $record->update([
                            'status'       => BookingStatus::Expired,
                            'expired_at'   => now(),
                            'cancelled_by' => 'kasir',
                        ]);
                        Notification::make()->title('Pembayaran booking #' . $record->booking_number . ' ditolak.')->warning()->send();
                    }),
                Actions\Action::make('mulai')
                    ->label('Mulai')
                    ->icon('heroicon-o-play')
                    ->color('info')
                    ->visible(fn(Booking $record) => $record->status === BookingStatus::Confirmed)
                    ->requiresConfirmation()
                    ->action(function (Booking $record) {
                        $record->update(['status' => BookingStatus::InProgress, 'started_at' => now()]);
                        Notification::make()->title('Sesi booking #' . $record->booking_number . ' dimulai.')->success()->send();
                    }),
                Actions\Action::make('checkout')
                    ->label('Checkout')
                    ->icon('heroicon-o-banknotes')
                    ->color('warning')
                    ->visible(fn(Booking $record) => $record->status === BookingStatus::InProgress)
                    ->action(fn(Booking $record, $livewire) => $livewire->dispatch('open-pos-modal', bookingId: $record->id)),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBookings::route('/'),
        ];
    }
}
