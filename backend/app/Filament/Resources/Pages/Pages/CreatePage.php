<?php

namespace App\Filament\Resources\Pages\Pages;

use App\Filament\Resources\Pages\PageResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePage extends CreateRecord
{
    protected static string $resource = PageResource::class;

    protected static ?string $title = 'გვერდის დამატება';

    protected static bool $canCreateAnother = false;

    public function getBreadcrumb(): string
    {
        return 'გვერდის დამატება';
    }
}
