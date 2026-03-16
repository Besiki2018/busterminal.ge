<?php

namespace App\Filament\Pages\HomepageSections;

use BackedEnum;
use Filament\Support\Icons\Heroicon;

class EditFooterSection extends EditHomepageSectionPage
{
    protected static ?string $slug = 'homepage-components/footer';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleGroup;

    protected static ?int $navigationSort = 8;

    protected static function getSectionKey(): string
    {
        return 'footer';
    }
}
