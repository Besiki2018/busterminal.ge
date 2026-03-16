<?php

namespace App\Filament\Resources\Partners\Pages;

use App\Filament\Resources\Partners\PartnerResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

class EditPartner extends EditRecord
{
    protected static string $resource = PartnerResource::class;

    protected static ?string $title = 'პარტნიორის რედაქტირება';

    public function getBreadcrumb(): string
    {
        return 'პარტნიორის რედაქტირება';
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('back')
                ->label('უკან')
                ->color('gray')
                ->url(PartnerResource::getUrl()),
        ];
    }
}
