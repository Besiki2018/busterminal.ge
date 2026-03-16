<?php

namespace App\Filament\Resources\DestinationRoutes\Pages;

use App\Filament\Resources\DestinationRoutes\DestinationRouteResource;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Resources\Pages\ManageRecords;

class ManageDestinationRoutes extends ManageRecords
{
    protected static string $resource = DestinationRouteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create')
                ->label('მიმართულების დამატება')
                ->icon(Heroicon::OutlinedPlus)
                ->color('primary')
                ->url(DestinationRouteResource::getUrl('create')),
        ];
    }
}
