<?php

namespace App\Support;

use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AdminFormLayout
{
    /**
     * @param  array<\Filament\Schemas\Components\Component>  $components
     */
    public static function apply(Schema $schema, array $components): Schema
    {
        $mainComponents = [];
        $sidebarComponents = [];

        foreach ($components as $component) {
            if ($component->getMeta('btFormColumn') === 'sidebar') {
                $sidebarComponents[] = $component;

                continue;
            }

            $mainComponents[] = $component;
        }

        $layout = [];

        if ($mainComponents !== []) {
            $layout[] = Group::make($mainComponents)
                ->columns([
                    'default' => 1,
                ])
                ->columnSpan([
                    'xl' => $sidebarComponents !== [] ? 2 : 3,
                ])
                ->extraAttributes([
                    'class' => 'bt-admin-main-column',
                ]);
        }

        if ($sidebarComponents !== []) {
            $layout[] = Group::make($sidebarComponents)
                ->columns([
                    'default' => 1,
                ])
                ->columnSpan([
                    'xl' => 1,
                ])
                ->columnStart([
                    'xl' => 3,
                ])
                ->extraAttributes([
                    'class' => 'bt-admin-sidebar-column',
                ]);
        }

        return $schema
            ->columns([
                'default' => 1,
                'xl' => 3,
            ])
            ->components($layout);
    }

    /**
     * @param  array<\Filament\Schemas\Components\Component>  $schema
     */
    public static function mainSection(string $title, array $schema, ?string $description = null): Section
    {
        $section = Section::make($title)
            ->schema($schema)
            ->meta('btFormColumn', 'main')
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
            ->meta('btFormColumn', 'sidebar')
            ->extraAttributes([
                'class' => 'bt-admin-editor-sidebar',
            ]);

        if (filled($description)) {
            $section->description($description);
        }

        return $section;
    }
}
