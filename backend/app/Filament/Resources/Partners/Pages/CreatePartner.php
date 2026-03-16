<?php

namespace App\Filament\Resources\Partners\Pages;

use App\Filament\Resources\Partners\PartnerResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePartner extends CreateRecord
{
    protected static string $resource = PartnerResource::class;

    protected static ?string $title = 'პარტნიორის დამატება';

    protected static bool $canCreateAnother = false;

    public function getBreadcrumb(): string
    {
        return 'პარტნიორის დამატება';
    }
}
