<?php

namespace App\Filament\Barber\Pages;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Tables;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;

class HariIni extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string                 $navigationLabel = 'Booking Hari Ini';
    protected static ?string                 $title           = 'Booking Hari Ini';
    protected static \BackedEnum|string|null $navigationIcon  = 'heroicon-o-calendar-days';
    protected static ?int                    $navigationSort  = 2;
    protected string $view = 'filament.barber.pages.hari-ini';

    public function table(Table $table): Table
    {
        $barberId = auth()->user()->barber?->id;

        return $table
            ->query(
                Booking::query()
                    ->where('barber_id', $barberId)
                    ->whereDate('scheduled_at', today())
                    ->whereNotIn('status', [BookingStatus::Cancelled->value, BookingStatus::Expired->value])
                    ->with(['services:id,booking_id,service_name'])
            )
            ->defaultSort('scheduled_at')
            ->columns([
                Tables\Columns\TextColumn::make('booking_number')
                    ->label('No. Booking')
                    ->searchable(),
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Pelanggan'),
                Tables\Columns\TextColumn::make('customer_phone')
                    ->label('Telepon')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('services')
                    ->label('Layanan')
                    ->badge()
                    ->getStateUsing(fn(Booking $record) => $record->services->pluck('service_name')->all()),
                Tables\Columns\TextColumn::make('scheduled_at')
                    ->label('Jam')
                    ->dateTime('H:i'),
                Tables\Columns\TextColumn::make('total_duration_minutes')
                    ->label('Durasi')
                    ->formatStateUsing(fn($state) => $state . ' mnt')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn($state) => match ($state->value ?? $state) {
                        'pending_payment', 'pending_confirmation' => 'gray',
                        'confirmed'   => 'info',
                        'in_progress' => 'warning',
                        'completed'   => 'success',
                        default       => 'gray',
                    })
                    ->formatStateUsing(fn($state) => match ($state->value ?? $state) {
                        'pending_payment'      => 'Menunggu Pembayaran',
                        'pending_confirmation' => 'Menunggu Verifikasi',
                        'confirmed'            => 'Terkonfirmasi',
                        'in_progress'          => 'Sedang Berlangsung',
                        'completed'            => 'Selesai',
                        default                => $state->value ?? $state,
                    }),
            ])
            ->actions([
                Actions\Action::make('mulai')
                    ->label('Mulai')
                    ->icon('heroicon-o-play')
                    ->color('info')
                    ->visible(fn(Booking $record) => $record->status === BookingStatus::Confirmed)
                    ->requiresConfirmation()
                    ->modalHeading('Mulai Sesi')
                    ->modalDescription('Tandai booking ini sebagai sedang berlangsung?')
                    ->action(function (Booking $record) {
                        $record->update([
                            'status'     => BookingStatus::InProgress,
                            'started_at' => now(),
                        ]);
                        Notification::make()->title('Sesi dimulai.')->success()->send();
                    }),
            ])
            ->emptyStateHeading('Tidak ada booking hari ini')
            ->emptyStateDescription('Selamat menikmati hari!')
            ->emptyStateIcon('heroicon-o-calendar-days');
    }
}
