<?php

namespace App\Filament\Pages\HomepageSections;

use BackedEnum;
use Filament\Support\Icons\Heroicon;

class EditContactSection extends EditHomepageSectionPage
{
    protected static ?string $slug = 'homepage-components/contact';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhone;

    protected static ?int $navigationSort = 7;

    protected static function getSectionKey(): string
    {
        return 'contact';
    }
}
