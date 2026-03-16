<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'slug',
        'page_type',
        'route_path',
        'nav_label_ka',
        'nav_label_en',
        'nav_label_ru',
        'title_ka',
        'title_en',
        'title_ru',
        'excerpt_ka',
        'excerpt_en',
        'excerpt_ru',
        'content_ka',
        'content_en',
        'content_ru',
        'cover_image_url',
        'seo_title_ka',
        'seo_title_en',
        'seo_title_ru',
        'seo_description_ka',
        'seo_description_en',
        'seo_description_ru',
        'seo_keywords_ka',
        'seo_keywords_en',
        'seo_keywords_ru',
        'seo_image_url',
        'noindex',
        'published',
        'show_in_navigation',
        'sort_order',
    ];

    protected static function booted(): void
    {
        static::saving(function (Page $page): void {
            $page->page_type ??= 'custom';

            if ($page->page_type === 'custom') {
                $page->route_path = filled($page->slug) ? "/page/{$page->slug}" : null;
            } elseif (blank($page->route_path) && filled($page->slug)) {
                $page->route_path = $page->slug === 'home' ? '/' : "/{$page->slug}";
            }
        });
    }

    protected function casts(): array
    {
        return [
            'noindex' => 'boolean',
            'published' => 'boolean',
            'show_in_navigation' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
