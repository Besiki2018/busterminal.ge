<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('pages')
            ->where('page_type', 'system')
            ->whereIn('slug', ['about', 'destinations', 'schedule', 'partners', 'leadership', 'contact', 'blog'])
            ->update([
                'show_in_navigation' => true,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('pages')
            ->where('page_type', 'system')
            ->whereIn('slug', ['about', 'destinations', 'schedule', 'partners', 'leadership', 'contact', 'blog'])
            ->update([
                'show_in_navigation' => false,
                'updated_at' => now(),
            ]);
    }
};
