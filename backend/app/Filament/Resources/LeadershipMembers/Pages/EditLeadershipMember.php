<?php

namespace App\Filament\Resources\LeadershipMembers\Pages;

use App\Filament\Resources\LeadershipMembers\LeadershipMemberResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

class EditLeadershipMember extends EditRecord
{
    protected static string $resource = LeadershipMemberResource::class;

    protected static ?string $title = 'ხელმძღვანელის რედაქტირება';

    public function getBreadcrumb(): string
    {
        return 'ხელმძღვანელის რედაქტირება';
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('back')
                ->label('უკან')
                ->color('gray')
                ->url(LeadershipMemberResource::getUrl()),
        ];
    }
}
