<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadershipMember extends Model
{
    protected $fillable = [
        'name',
        'role_key',
        'phone',
        'linkedin',
        'whatsapp_enabled',
        'published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'whatsapp_enabled' => 'boolean',
            'published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
