<?php

namespace App\Filament\Resources\LeadershipMembers\Pages;

use App\Filament\Resources\LeadershipMembers\LeadershipMemberResource;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Resources\Pages\ManageRecords;

class ManageLeadershipMembers extends ManageRecords
{
    protected static string $resource = LeadershipMemberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create')
                ->label('ხელმძღვანელის დამატება')
                ->icon(Heroicon::OutlinedPlus)
                ->color('primary')
                ->url(LeadershipMemberResource::getUrl('create')),
        ];
    }
}
