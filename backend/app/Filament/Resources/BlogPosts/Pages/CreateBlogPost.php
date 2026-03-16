<?php

namespace App\Filament\Resources\BlogPosts\Pages;

use App\Filament\Resources\BlogPosts\BlogPostResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBlogPost extends CreateRecord
{
    protected static string $resource = BlogPostResource::class;

    protected static ?string $title = 'ბლოგ პოსტის დამატება';

    protected static bool $canCreateAnother = false;

    public function getBreadcrumb(): string
    {
        return 'ბლოგ პოსტის დამატება';
    }
}
