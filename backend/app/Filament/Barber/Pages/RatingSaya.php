<?php

namespace App\Filament\Barber\Pages;

use App\Models\Rating;
use Filament\Pages\Page;
use Filament\Tables;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;

class RatingSaya extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string                 $navigationLabel = 'Rating Saya';
    protected static ?string                 $title           = 'Rating Saya';
    protected static \BackedEnum|string|null $navigationIcon  = 'heroicon-o-star';
    protected static ?int                    $navigationSort  = 4;
    protected string $view = 'filament.barber.pages.rating-saya';

    public float $avgRating    = 0;
    public int   $totalRatings = 0;
    public int   $fiveStar     = 0;
    public int   $fourStar     = 0;
    public int   $threeStar    = 0;
    public int   $twoStar      = 0;
    public int   $oneStar      = 0;

    public function mount(): void
    {
        $barberId = auth()->user()->barber?->id;
        if (! $barberId) return;

        $ratings = Rating::where('barber_id', $barberId)->get();

        $this->totalRatings = $ratings->count();
        $this->avgRating    = $this->totalRatings
            ? round($ratings->avg('stars'), 1)
            : 0;

        $this->fiveStar  = $ratings->where('stars', 5)->count();
        $this->fourStar  = $ratings->where('stars', 4)->count();
        $this->threeStar = $ratings->where('stars', 3)->count();
        $this->twoStar   = $ratings->where('stars', 2)->count();
        $this->oneStar   = $ratings->where('stars', 1)->count();
    }

    public function table(Table $table): Table
    {
        $barberId = auth()->user()->barber?->id;

        return $table
            ->query(
                Rating::query()
                    ->where('barber_id', $barberId)
                    ->with(['booking:id,customer_name,scheduled_at'])
            )
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('customer')
                    ->label('Pelanggan')
                    ->getStateUsing(fn(Rating $record) => $record->is_anonymous
                        ? 'Anonim'
                        : ($record->booking?->customer_name ?? '-')),
                Tables\Columns\TextColumn::make('stars')
                    ->label('Bintang')
                    ->badge()
                    ->color(fn($state) => match (true) {
                        $state >= 4 => 'success',
                        $state >= 3 => 'warning',
                        default     => 'danger',
                    })
                    ->formatStateUsing(fn($state) => str_repeat('★', $state) . str_repeat('☆', 5 - $state)),
                Tables\Columns\TextColumn::make('comment')
                    ->label('Komentar')
                    ->placeholder('—')
                    ->wrap()
                    ->limit(100),
                Tables\Columns\TextColumn::make('booking.scheduled_at')
                    ->label('Tanggal Kunjungan')
                    ->date('d M Y')
                    ->placeholder('-'),
            ])
            ->emptyStateHeading('Belum ada rating')
            ->emptyStateDescription('Rating dari pelanggan akan muncul di sini.')
            ->emptyStateIcon('heroicon-o-star');
    }
}
