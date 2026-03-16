<?php

namespace App\Filament\Resources\DestinationRoutes\Pages;

use App\Filament\Resources\DestinationRoutes\DestinationRouteResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

class EditDestinationRoute extends EditRecord
{
    protected static string $resource = DestinationRouteResource::class;

    protected static ?string $title = 'მიმართულების რედაქტირება';

    public function getBreadcrumb(): string
    {
        return 'მიმართულების რედაქტირება';
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('back')
                ->label('უკან')
                ->color('gray')
                ->url(DestinationRouteResource::getUrl()),
        ];
    }
}
