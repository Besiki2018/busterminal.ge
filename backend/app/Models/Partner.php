<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $fillable = [
        'name',
        'description_ka',
        'description_en',
        'description_ru',
        'routes_ka',
        'routes_en',
        'routes_ru',
        'website',
        'logo_url',
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
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'noindex' => 'boolean',
            'published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
