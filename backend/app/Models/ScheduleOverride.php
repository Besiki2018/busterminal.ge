<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleOverride extends Model
{
    protected $fillable = [
        'departure_time',
        'destination_ka',
        'destination_en',
        'destination_ru',
        'operator',
        'buy_ticket_url',
        'published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
