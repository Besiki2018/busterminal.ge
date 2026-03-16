<?php

namespace App\Filament\Resources\Pages\Pages;

use App\Filament\Resources\Pages\PageResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

class EditPage extends EditRecord
{
    protected static string $resource = PageResource::class;

    protected static ?string $title = 'გვერდის რედაქტირება';

    public function getBreadcrumb(): string
    {
        return 'გვერდის რედაქტირება';
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('back')
                ->label('უკან')
                ->color('gray')
                ->url(PageResource::getUrl()),
        ];
    }
}
