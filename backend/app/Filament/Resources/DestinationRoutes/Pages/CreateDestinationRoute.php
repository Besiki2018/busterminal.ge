<?php

namespace App\Filament\Resources\DestinationRoutes\Pages;

use App\Filament\Resources\DestinationRoutes\DestinationRouteResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDestinationRoute extends CreateRecord
{
    protected static string $resource = DestinationRouteResource::class;

    protected static ?string $title = 'მიმართულების დამატება';

    protected static bool $canCreateAnother = false;

    public function getBreadcrumb(): string
    {
        return 'მიმართულების დამატება';
    }
}
