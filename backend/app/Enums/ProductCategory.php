<?php

namespace App\Enums;

enum ProductCategory: string
{
    case ClayPomade       = 'clay_pomade';
    case Skincare         = 'skincare';
    case ToolsAccessories = 'tools_accessories';
    case Fragrance        = 'fragrance';
    case Vitamins         = 'vitamins';
    case GroomingKits     = 'grooming_kits';

    public function label(): string
    {
        return match ($this) {
            self::ClayPomade       => 'Clay & Pomade',
            self::Skincare         => 'Skincare',
            self::ToolsAccessories => 'Tools & Accessories',
            self::Fragrance        => 'Fragrance',
            self::Vitamins         => 'Vitamins',
            self::GroomingKits     => 'Grooming Kits',
        };
    }

    /** @return array<string, string> value => label, for Filament options/filters. */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn(self $c) => [$c->value => $c->label()])
            ->all();
    }
}
