<?php

namespace App\Filament\Resources\Pages\Pages;

use App\Filament\Resources\Pages\PageResource;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Resources\Pages\ManageRecords;

class ManagePages extends ManageRecords
{
    protected static string $resource = PageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create')
                ->label('გვერდის დამატება')
                ->icon(Heroicon::OutlinedPlus)
                ->color('primary')
                ->url(PageResource::getUrl('create')),
        ];
    }
}
