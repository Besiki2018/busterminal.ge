<?php

namespace App\Filament\Pages\HomepageSections;

use BackedEnum;
use Filament\Support\Icons\Heroicon;

class EditHeroSection extends EditHomepageSectionPage
{
    protected static ?string $slug = 'homepage-components/hero';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static ?int $navigationSort = 1;

    protected static function getSectionKey(): string
    {
        return 'hero';
    }
}
