<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'slug',
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
        'author_name',
        'published_at',
        'published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'noindex' => 'boolean',
            'published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
