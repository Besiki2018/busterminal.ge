<?php

namespace App\Filament\Resources\BlogPosts\Pages;

use App\Filament\Resources\BlogPosts\BlogPostResource;
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Resources\Pages\ManageRecords;

class ManageBlogPosts extends ManageRecords
{
    protected static string $resource = BlogPostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create')
                ->label('პოსტის დამატება')
                ->icon(Heroicon::OutlinedPlus)
                ->color('primary')
                ->url(BlogPostResource::getUrl('create')),
        ];
    }
}
