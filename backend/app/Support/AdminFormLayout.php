<?php

namespace App\Support;

use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AdminFormLayout
{
    /**
     * @param  array<\Filament\Schemas\Components\Component>  $components
     */
    public static function apply(Schema $schema, array $components): Schema
    {
        return $schema
            ->columns([
                'default' => 1,
                'xl' => 3,
            ])
            ->components($components);
    }

    /**
     * @param  array<\Filament\Schemas\Components\Component>  $schema
     */
    public static function mainSection(string $title, array $schema, ?string $description = null): Section
    {
        $section = Section::make($title)
            ->schema($schema)
            ->columnSpan([
                'xl' => 2,
            ])
            ->extraAttributes([
                'class' => 'bt-admin-editor-main',
            ]);

        if (filled($description)) {
            $section->description($description);
        }

        return $section;
    }

    /**
     * @param  array<\Filament\Schemas\Components\Component>  $schema
     */
    public static function sidebarSection(string $title, array $schema, ?string $description = null): Section
    {
        $section = Section::make($title)
            ->schema($schema)
            ->columnSpan([
                'xl' => 1,
            ])
            ->extraAttributes([
                'class' => 'bt-admin-editor-sidebar',
            ]);

        if (filled($description)) {
            $section->description($description);
        }

        return $section;
    }
}
