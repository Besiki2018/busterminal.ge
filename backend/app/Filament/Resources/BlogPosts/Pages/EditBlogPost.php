<?php

namespace App\Filament\Resources\BlogPosts\Pages;

use App\Filament\Resources\BlogPosts\BlogPostResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;

class EditBlogPost extends EditRecord
{
    protected static string $resource = BlogPostResource::class;

    protected static ?string $title = 'ბლოგ პოსტის რედაქტირება';

    public function getBreadcrumb(): string
    {
        return 'ბლოგ პოსტის რედაქტირება';
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('back')
                ->label('უკან')
                ->color('gray')
                ->url(BlogPostResource::getUrl()),
        ];
    }
}
