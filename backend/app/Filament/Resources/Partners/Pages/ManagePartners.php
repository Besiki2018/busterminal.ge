<?php

namespace App\Filament\Resources\Partners\Pages;

use App\Filament\Resources\Partners\PartnerResource;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Resources\Pages\ManageRecords;

class ManagePartners extends ManageRecords
{
    protected static string $resource = PartnerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create')
                ->label('პარტნიორის დამატება')
                ->icon(Heroicon::OutlinedPlus)
                ->color('primary')
                ->url(PartnerResource::getUrl('create')),
        ];
    }
}
