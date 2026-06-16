<?php

namespace App\Filament\Barber\Pages;

use App\Models\BarberShift;
use Filament\Pages\Page;
use Filament\Tables;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;

class Jadwal extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string                 $navigationLabel = 'Jadwal';
    protected static ?string                 $title           = 'Jadwal Minggu Ini';
    protected static \BackedEnum|string|null $navigationIcon  = 'heroicon-o-clock';
    protected static ?int                    $navigationSort  = 3;
    protected string $view = 'filament.barber.pages.jadwal';

    public function table(Table $table): Table
    {
        $barberId = auth()->user()->barber?->id;

        return $table
            ->query(
                BarberShift::query()
                    ->where('barber_id', $barberId)
                    ->whereBetween('shift_date', [today(), today()->addDays(6)])
                    ->with('branch:id,name')
            )
            ->defaultSort('shift_date')
            ->columns([
                Tables\Columns\TextColumn::make('shift_date')
                    ->label('Tanggal')
                    ->date('l, d M Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('branch.name')
                    ->label('Cabang'),
                Tables\Columns\TextColumn::make('start_time')
                    ->label('Masuk'),
                Tables\Columns\TextColumn::make('end_time')
                    ->label('Pulang'),
                Tables\Columns\TextColumn::make('break_start')
                    ->label('Mulai Istirahat')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('break_end')
                    ->label('Selesai Istirahat')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn($state) => match ($state->value ?? $state) {
                        'scheduled' => 'gray',
                        'on_duty'   => 'success',
                        'completed' => 'info',
                        'cancelled' => 'danger',
                        default     => 'gray',
                    })
                    ->formatStateUsing(fn($state) => match ($state->value ?? $state) {
                        'scheduled' => 'Dijadwalkan',
                        'on_duty'   => 'Sedang Bertugas',
                        'completed' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                        default     => $state->value ?? $state,
                    }),
            ])
            ->emptyStateHeading('Tidak ada jadwal minggu ini')
            ->emptyStateIcon('heroicon-o-clock');
    }
}
