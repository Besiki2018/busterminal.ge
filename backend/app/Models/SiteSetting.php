<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'hero_ka',
        'hero_en',
        'hero_ru',
        'about_ka',
        'about_en',
        'about_ru',
        'contact_ka',
        'contact_en',
        'contact_ru',
        'footer_ka',
        'footer_en',
        'footer_ru',
    ];

    protected function casts(): array
    {
        return [
            'hero_ka' => 'array',
            'hero_en' => 'array',
            'hero_ru' => 'array',
            'about_ka' => 'array',
            'about_en' => 'array',
            'about_ru' => 'array',
            'contact_ka' => 'array',
            'contact_en' => 'array',
            'contact_ru' => 'array',
            'footer_ka' => 'array',
            'footer_en' => 'array',
            'footer_ru' => 'array',
        ];
    }
}
