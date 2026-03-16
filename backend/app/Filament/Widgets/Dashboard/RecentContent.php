<?php

namespace App\Filament\Widgets\Dashboard;

use App\Models\BlogPost;
use App\Models\Page;
use App\Models\ScheduleOverride;
use Filament\Widgets\Widget;

class RecentContent extends Widget
{
    protected static bool $isLazy = false;

    protected static ?int $sort = 3;

    protected string $view = 'filament.widgets.dashboard.recent-content';

    protected int | string | array $columnSpan = 'full';

    protected function getViewData(): array
    {
        return [
            'pages' => Page::query()->latest('updated_at')->limit(4)->get(),
            'posts' => BlogPost::query()->latest('updated_at')->limit(4)->get(),
            'schedules' => ScheduleOverride::query()->latest('updated_at')->limit(4)->get(),
        ];
    }
}
