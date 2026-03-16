<?php

namespace App\Filament\Pages;

use Filament\Support\Icons\Heroicon;

class Dashboard extends \Filament\Pages\Dashboard
{
    protected static ?string $title = 'მართვის პანელი';

    protected static string | \BackedEnum | null $navigationIcon = Heroicon::OutlinedSquares2x2;

    public function getTitle(): string
    {
        return 'მართვის პანელი';
    }
}
