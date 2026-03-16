<?php

namespace App\Filament\Resources\ScheduleOverrides\Pages;

use App\Filament\Resources\ScheduleOverrides\ScheduleOverrideResource;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Resources\Pages\ManageRecords;

class ManageScheduleOverrides extends ManageRecords
{
    protected static string $resource = ScheduleOverrideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create')
                ->label('განრიგის ჩანაწერის დამატება')
                ->icon(Heroicon::OutlinedPlus)
                ->color('primary')
                ->url(ScheduleOverrideResource::getUrl('create')),
        ];
    }
}
