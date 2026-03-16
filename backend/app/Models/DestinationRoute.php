<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DestinationRoute extends Model
{
    protected $fillable = [
        'slug',
        'route_type',
        'city_ka',
        'city_en',
        'city_ru',
        'country_ka',
        'country_en',
        'country_ru',
        'duration',
        'price_from',
        'provider_links',
        'show_in_footer',
        'published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'provider_links' => 'array',
            'show_in_footer' => 'boolean',
            'published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
