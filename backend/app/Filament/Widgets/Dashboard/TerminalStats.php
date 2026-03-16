<?php

namespace App\Filament\Widgets\Dashboard;

use App\Models\BlogPost;
use App\Models\DestinationRoute;
use App\Models\Page;
use App\Models\ScheduleOverride;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TerminalStats extends StatsOverviewWidget
{
    protected static bool $isLazy = false;

    protected static ?int $sort = 1;

    protected ?string $heading = 'ტერმინალის ძირითადი მაჩვენებლები';

    protected function getStats(): array
    {
        return [
            Stat::make('გამოქვეყნებული გვერდები', Page::query()->where('published', true)->count())
                ->icon(Heroicon::DocumentDuplicate)
                ->chart([3, 4, 5, 5, 6, 7, 7])
                ->color('primary'),
            Stat::make('ბლოგის პოსტები', BlogPost::query()->where('published', true)->count())
                ->icon(Heroicon::ChatBubbleLeftRight)
                ->chart([1, 2, 3, 3, 4, 5, 6])
                ->color('success'),
            Stat::make('აქტიური მიმართულებები', DestinationRoute::query()->where('published', true)->count())
                ->icon(Heroicon::MapPin)
                ->chart([8, 9, 10, 10, 11, 12, 12])
                ->color('warning'),
            Stat::make('ხელით დამატებული განრიგები', ScheduleOverride::query()->where('published', true)->count())
                ->icon(Heroicon::CalendarDays)
                ->chart([0, 1, 1, 2, 2, 3, 4])
                ->color('gray'),
        ];
    }
}
