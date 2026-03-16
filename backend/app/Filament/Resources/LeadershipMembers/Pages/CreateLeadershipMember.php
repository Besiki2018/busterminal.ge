<?php

namespace App\Filament\Resources\LeadershipMembers\Pages;

use App\Filament\Resources\LeadershipMembers\LeadershipMemberResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLeadershipMember extends CreateRecord
{
    protected static string $resource = LeadershipMemberResource::class;

    protected static ?string $title = 'ხელმძღვანელის დამატება';

    protected static bool $canCreateAnother = false;

    public function getBreadcrumb(): string
    {
        return 'ხელმძღვანელის დამატება';
    }
}
