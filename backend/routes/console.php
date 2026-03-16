<?php

use App\Models\BlogPost;
use App\Models\Page;
use App\Support\CmsData;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('seo:export {--output= : Optional file path for JSON output}', function () {
    $languages = ['ka', 'en', 'ru'];

    $payload = [
        'generatedAt' => now()->toIso8601String(),
        'languages' => collect($languages)
            ->mapWithKeys(function (string $language): array {
                $pages = Page::query()
                    ->where('published', true)
                    ->orderBy('sort_order')
                    ->orderBy('id')
                    ->get()
                    ->map(fn (Page $page): array => CmsData::page($page, $language))
                    ->values()
                    ->all();

                $blogPosts = BlogPost::query()
                    ->where('published', true)
                    ->orderByDesc('published_at')
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn (BlogPost $post): array => CmsData::blogPost($post, $language))
                    ->values()
                    ->all();

                return [
                    $language => [
                        'homepage' => CmsData::homepage($language),
                        'pages' => $pages,
                        'blogPosts' => $blogPosts,
                        'schedules' => CmsData::schedules($language),
                    ],
                ];
            })
            ->all(),
    ];

    $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

    if (! is_string($json)) {
        $this->error('Failed to encode SEO export payload.');

        return self::FAILURE;
    }

    $outputPath = $this->option('output');

    if (filled($outputPath)) {
        File::ensureDirectoryExists(dirname($outputPath));
        File::put($outputPath, $json);
        $this->info("SEO export written to {$outputPath}");

        return self::SUCCESS;
    }

    $this->line($json);

    return self::SUCCESS;
})->purpose('Export localized CMS data for prerendered SEO pages');
