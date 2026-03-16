<?php

namespace App\Filament\Resources\ScheduleOverrides\Pages;

use App\Filament\Resources\ScheduleOverrides\ScheduleOverrideResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

class EditScheduleOverride extends EditRecord
{
    protected static string $resource = ScheduleOverrideResource::class;

    protected static ?string $title = 'განრიგის ჩანაწერის რედაქტირება';

    public function getBreadcrumb(): string
    {
        return 'განრიგის ჩანაწერის რედაქტირება';
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('back')
                ->label('უკან')
                ->color('gray')
                ->url(ScheduleOverrideResource::getUrl()),
        ];
    }
}
