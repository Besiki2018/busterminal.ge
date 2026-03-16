<?php

namespace App\Support;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class AdminSeoSchema
{
    public static function localeTabs(): Tabs
    {
        return Tabs::make('seo_tabs')
            ->contained(false)
            ->activeTab(AdminContentLocale::activeTab())
            ->tabs([
                self::localeTab('ka', 'ქართული'),
                self::localeTab('en', 'English'),
                self::localeTab('ru', 'Русский'),
            ])
            ->columnSpanFull();
    }

    protected static function localeTab(string $locale, string $label): Tab
    {
        return Tab::make($label)
            ->schema([
                TextInput::make("seo_title_{$locale}")
                    ->label('SEO სათაური')
                    ->columnSpanFull(),
                Textarea::make("seo_description_{$locale}")
                    ->label('SEO აღწერა')
                    ->rows(4)
                    ->columnSpanFull(),
                Textarea::make("seo_keywords_{$locale}")
                    ->label('SEO keywords')
                    ->rows(3)
                    ->columnSpanFull(),
            ]);
    }
}
