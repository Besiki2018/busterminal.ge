<?php

namespace App\Filament\Pages\HomepageSections;

use BackedEnum;
use Filament\Support\Icons\Heroicon;

class EditAboutSection extends EditHomepageSectionPage
{
    protected static ?string $slug = 'homepage-components/about';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInformationCircle;

    protected static ?int $navigationSort = 2;

    protected static function getSectionKey(): string
    {
        return 'about';
    }
}
