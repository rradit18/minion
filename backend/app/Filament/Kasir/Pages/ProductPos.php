<?php

namespace App\Filament\Kasir\Pages;

use Filament\Pages\Page;

class ProductPos extends Page
{
    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-shopping-cart';

    protected static ?string $navigationLabel = 'POS Produk';

    protected static ?string $title = 'POS Produk';

    protected static ?int $navigationSort = 2;

    protected string $view = 'filament.kasir.pages.product-pos';
}
