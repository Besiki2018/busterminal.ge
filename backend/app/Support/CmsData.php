<?php

namespace App\Support;

use App\Models\BlogPost;
use App\Models\DestinationRoute;
use App\Models\LeadershipMember;
use App\Models\Page;
use App\Models\Partner;
use App\Models\ScheduleOverride;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CmsData
{
    protected const LANGUAGES = ['ka', 'en', 'ru'];

    protected const FALLBACK_SCHEDULES = [
        ['time' => '06:00', 'destination' => 'Batumi', 'operator' => 'Omnibus', 'buyTicketUrl' => 'https://omnibus.ge'],
        ['time' => '06:30', 'destination' => 'Kutaisi', 'operator' => 'Metro Georgia', 'buyTicketUrl' => 'https://metrogeorgia.ge'],
        ['time' => '07:00', 'destination' => 'Telavi', 'operator' => 'TKT.GE', 'buyTicketUrl' => 'https://tkt.ge/ortachala'],
        ['time' => '07:30', 'destination' => 'Batumi', 'operator' => 'Citybus', 'buyTicketUrl' => 'https://citybus.ge'],
        ['time' => '08:00', 'destination' => 'Zugdidi', 'operator' => 'Omnibus', 'buyTicketUrl' => 'https://omnibus.ge'],
        ['time' => '08:30', 'destination' => 'Gori', 'operator' => 'Metro Georgia', 'buyTicketUrl' => 'https://metrogeorgia.ge'],
        ['time' => '09:00', 'destination' => 'Yerevan', 'operator' => 'TKT.GE', 'buyTicketUrl' => 'https://tkt.ge/ortachala'],
        ['time' => '09:30', 'destination' => 'Mestia', 'operator' => 'Omnibus', 'buyTicketUrl' => 'https://omnibus.ge'],
        ['time' => '10:00', 'destination' => 'Kutaisi', 'operator' => 'Citybus', 'buyTicketUrl' => 'https://citybus.ge'],
        ['time' => '10:30', 'destination' => 'Batumi', 'operator' => 'Metro Georgia', 'buyTicketUrl' => 'https://metrogeorgia.ge'],
        ['time' => '11:00', 'destination' => 'Kvareli', 'operator' => 'TKT.GE', 'buyTicketUrl' => 'https://tkt.ge/ortachala'],
        ['time' => '12:00', 'destination' => 'Zugdidi', 'operator' => 'Citybus', 'buyTicketUrl' => 'https://citybus.ge'],
        ['time' => '14:00', 'destination' => 'Batumi', 'operator' => 'Omnibus', 'buyTicketUrl' => 'https://omnibus.ge'],
        ['time' => '16:00', 'destination' => 'Kutaisi', 'operator' => 'Metro Georgia', 'buyTicketUrl' => 'https://metrogeorgia.ge'],
        ['time' => '18:00', 'destination' => 'Yerevan', 'operator' => 'TKT.GE', 'buyTicketUrl' => 'https://tkt.ge/ortachala'],
        ['time' => '20:00', 'destination' => 'Istanbul', 'operator' => 'TKT.GE', 'buyTicketUrl' => 'https://tkt.ge/ortachala'],
    ];

    protected const DESTINATION_TRANSLATIONS = [
        'Batumi' => ['ka' => 'ბათუმი', 'ru' => 'Батуми'],
        'Kutaisi' => ['ka' => 'ქუთაისი', 'ru' => 'Кутаиси'],
        'Telavi' => ['ka' => 'თელავი', 'ru' => 'Телави'],
        'Zugdidi' => ['ka' => 'ზუგდიდი', 'ru' => 'Зугдиди'],
        'Gori' => ['ka' => 'გორი', 'ru' => 'Гори'],
        'Mestia' => ['ka' => 'მესტია', 'ru' => 'Местия'],
        'Yerevan' => ['ka' => 'ერევანი', 'ru' => 'Ереван'],
        'Istanbul' => ['ka' => 'სტამბული', 'ru' => 'Стамбул'],
        'Kvareli' => ['ka' => 'ყვარელი', 'ru' => 'Кварели'],
    ];

    public static function normalizeLanguage(?string $language): string
    {
        return in_array($language, self::LANGUAGES, true) ? $language : 'ka';
    }

    public static function homepage(string $language): array
    {
        $language = self::normalizeLanguage($language);
        $siteSetting = SiteSetting::query()->first();

        $routes = DestinationRoute::query()
            ->where('published', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (DestinationRoute $route): array => self::mapRoute($route, $language))
            ->values()
            ->all();

        $footer = self::localizedSection($siteSetting, 'footer', $language);
        $footer['popularRoutes'] = filled($footer['popularRoutes'] ?? null)
            ? $footer['popularRoutes']
            : self::buildFooterRoutes($routes, $language);

        return [
            'hero' => self::localizedSection($siteSetting, 'hero', $language),
            'about' => self::localizedSection($siteSetting, 'about', $language),
            'routes' => $routes,
            'partners' => Partner::query()
                ->where('published', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (Partner $partner): array => self::mapPartner($partner, $language))
                ->values()
                ->all(),
            'leadershipMembers' => LeadershipMember::query()
                ->where('published', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (LeadershipMember $member): array => self::mapLeadershipMember($member))
                ->values()
                ->all(),
            'contact' => self::localizedSection($siteSetting, 'contact', $language),
            'footer' => $footer,
            'navigationPages' => Page::query()
                ->where('published', true)
                ->where('show_in_navigation', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (Page $page): array => [
                    'id' => (string) $page->id,
                    'slug' => $page->slug,
                    'path' => $page->route_path ?: "/page/{$page->slug}",
                    'label' => self::localizedField($page, 'nav_label', $language) ?: self::localizedField($page, 'title', $language),
                ])
                ->values()
                ->all(),
        ];
    }

    public static function page(Page $page, string $language): array
    {
        $language = self::normalizeLanguage($language);

        return [
            'id' => (string) $page->id,
            'slug' => $page->slug,
            'title' => self::localizedField($page, 'title', $language),
            'excerpt' => self::localizedField($page, 'excerpt', $language),
            'content' => self::localizedField($page, 'content', $language),
            'coverImageUrl' => self::mediaUrl($page->cover_image_url),
            'pageType' => $page->page_type,
            'routePath' => $page->route_path,
            'showInNavigation' => $page->show_in_navigation,
            'seoTitle' => self::localizedField($page, 'seo_title', $language),
            'seoDescription' => self::localizedField($page, 'seo_description', $language),
            'seoKeywords' => self::localizedKeywords($page, $language),
            'seoImageUrl' => self::mediaUrl($page->seo_image_url),
            'noIndex' => (bool) $page->noindex,
        ];
    }

    public static function blogPost(BlogPost $post, string $language): array
    {
        $language = self::normalizeLanguage($language);

        return [
            'id' => (string) $post->id,
            'slug' => $post->slug,
            'title' => self::localizedField($post, 'title', $language),
            'excerpt' => self::localizedField($post, 'excerpt', $language),
            'content' => self::localizedField($post, 'content', $language),
            'coverImageUrl' => self::mediaUrl($post->cover_image_url),
            'authorName' => $post->author_name,
            'publishedAt' => $post->published_at?->toIso8601String(),
            'seoTitle' => self::localizedField($post, 'seo_title', $language),
            'seoDescription' => self::localizedField($post, 'seo_description', $language),
            'seoKeywords' => self::localizedKeywords($post, $language),
            'seoImageUrl' => self::mediaUrl($post->seo_image_url),
            'noIndex' => (bool) $post->noindex,
        ];
    }

    public static function schedules(string $language): array
    {
        $language = self::normalizeLanguage($language);

        $overrides = ScheduleOverride::query()
            ->where('published', true)
            ->orderBy('sort_order')
            ->orderBy('departure_time')
            ->get();

        if ($overrides->isNotEmpty()) {
            return $overrides
                ->map(fn (ScheduleOverride $row): array => [
                    'time' => self::normalizeTime($row->departure_time),
                    'destination' => self::localizedField($row, 'destination', $language),
                    'operator' => $row->operator,
                    'source' => 'manual',
                    'buyTicketUrl' => $row->buy_ticket_url ?? '',
                ])
                ->values()
                ->all();
        }

        return collect(self::FALLBACK_SCHEDULES)
            ->map(function (array $row) use ($language): array {
                return [
                    'time' => $row['time'],
                    'destination' => self::localizeFallbackDestination($row['destination'], $language),
                    'operator' => $row['operator'],
                    'source' => 'fallback',
                    'buyTicketUrl' => $row['buyTicketUrl'],
                ];
            })
            ->all();
    }

    protected static function localizedSection(?SiteSetting $siteSetting, string $section, string $language): array
    {
        if (! $siteSetting) {
            return [];
        }

        $value = $siteSetting->getAttribute("{$section}_{$language}");

        if (! is_array($value)) {
            return [];
        }

        if (($section === 'about') && is_array($value['gallery'] ?? null)) {
            $value['gallery'] = collect($value['gallery'])
                ->filter(fn (mixed $row): bool => is_array($row))
                ->map(function (array $row): array {
                    $row['src'] = self::mediaUrl($row['src'] ?? null) ?? '';

                    return $row;
                })
                ->filter(fn (array $row): bool => filled($row['src'] ?? null))
                ->values()
                ->all();
        }

        return $value;
    }

    protected static function localizedField(object $record, string $baseName, string $language): string
    {
        $key = "{$baseName}_{$language}";

        return (string) ($record->{$key} ?? '');
    }

    protected static function mapRoute(DestinationRoute $route, string $language): array
    {
        return [
            'id' => (string) $route->id,
            'routeType' => $route->route_type,
            'city' => self::localizedField($route, 'city', $language),
            'country' => self::localizedField($route, 'country', $language) ?: null,
            'duration' => $route->duration,
            'priceFrom' => $route->price_from,
            'providers' => collect($route->provider_links ?? [])
                ->filter(fn (mixed $row): bool => is_array($row))
                ->map(fn (array $row): array => [
                    'name' => (string) ($row['name'] ?? ''),
                    'url' => (string) ($row['url'] ?? ''),
                ])
                ->filter(fn (array $row): bool => filled($row['name']) && filled($row['url']))
                ->values()
                ->all(),
            'showInFooter' => $route->show_in_footer,
        ];
    }

    protected static function mapPartner(Partner $partner, string $language): array
    {
        return [
            'id' => (string) $partner->id,
            'name' => $partner->name,
            'description' => self::localizedField($partner, 'description', $language),
            'routes' => self::localizedField($partner, 'routes', $language),
            'website' => $partner->website,
            'logoUrl' => self::mediaUrl($partner->logo_url),
            'seoTitle' => self::localizedField($partner, 'seo_title', $language),
            'seoDescription' => self::localizedField($partner, 'seo_description', $language),
            'seoKeywords' => self::localizedKeywords($partner, $language),
            'seoImageUrl' => self::mediaUrl($partner->seo_image_url),
            'noIndex' => (bool) $partner->noindex,
        ];
    }

    /**
     * @return array<int, string>
     */
    protected static function localizedKeywords(object $record, string $language): array
    {
        $keywords = self::localizedField($record, 'seo_keywords', $language);

        return collect(explode(',', $keywords))
            ->map(fn (string $keyword): string => trim($keyword))
            ->filter()
            ->values()
            ->all();
    }

    protected static function mapLeadershipMember(LeadershipMember $member): array
    {
        return [
            'id' => (string) $member->id,
            'name' => $member->name,
            'role' => $member->role_key,
            'phone' => $member->phone,
            'linkedin' => $member->linkedin,
            'whatsappEnabled' => $member->whatsapp_enabled,
        ];
    }

    protected static function buildFooterRoutes(array $routes, string $language): array
    {
        $origin = match ($language) {
            'en' => 'Tbilisi',
            'ru' => 'Тбилиси',
            default => 'თბილისი',
        };

        return collect($routes)
            ->filter(fn (array $route): bool => (bool) ($route['showInFooter'] ?? false))
            ->take(5)
            ->map(fn (array $route): string => "{$origin} - {$route['city']}")
            ->values()
            ->all();
    }

    protected static function localizeFallbackDestination(string $destination, string $language): string
    {
        if ($language === 'en') {
            return $destination;
        }

        return self::DESTINATION_TRANSLATIONS[$destination][$language] ?? $destination;
    }

    protected static function normalizeTime(string $value): string
    {
        preg_match('/^\d{2}:\d{2}/', $value, $matches);

        return $matches[0] ?? $value;
    }

    protected static function mediaUrl(?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        if (Str::startsWith($value, ['http://', 'https://', '/'])) {
            return $value;
        }

        return url(Storage::disk('public')->url($value));
    }
}
