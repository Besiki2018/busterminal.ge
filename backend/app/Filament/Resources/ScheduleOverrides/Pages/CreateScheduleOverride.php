<?php

namespace App\Filament\Resources\ScheduleOverrides\Pages;

use App\Filament\Resources\ScheduleOverrides\ScheduleOverrideResource;
use Filament\Resources\Pages\CreateRecord;

class CreateScheduleOverride extends CreateRecord
{
    protected static string $resource = ScheduleOverrideResource::class;

    protected static ?string $title = 'განრიგის ჩანაწერის დამატება';

    protected static bool $canCreateAnother = false;

    public function getBreadcrumb(): string
    {
        return 'განრიგის ჩანაწერის დამატება';
    }
}
