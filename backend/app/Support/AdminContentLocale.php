<?php

namespace App\Support;

class AdminContentLocale
{
    public const SESSION_KEY = 'admin.content_locale';

    public static function default(): string
    {
        return 'ka';
    }

    /**
     * @return array<string, string>
     */
    public static function all(): array
    {
        return [
            'ka' => 'ქართული',
            'en' => 'English',
            'ru' => 'Русский',
        ];
    }

    public static function current(): string
    {
        $locale = session(self::SESSION_KEY, self::default());

        return array_key_exists($locale, self::all()) ? $locale : self::default();
    }

    public static function set(string $locale): void
    {
        session([self::SESSION_KEY => array_key_exists($locale, self::all()) ? $locale : self::default()]);
    }

    public static function activeTab(): int
    {
        return array_search(self::current(), array_keys(self::all()), true) + 1;
    }

    public static function field(string $prefix, ?string $locale = null): string
    {
        return "{$prefix}_" . ($locale ?? self::current());
    }

    public static function label(?string $locale = null): string
    {
        return self::all()[$locale ?? self::current()];
    }

    public static function publicSiteUrl(?string $locale = null): string
    {
        $baseUrl = rtrim(config('app.frontend_url', 'http://127.0.0.1:8080'), '/');

        return match ($locale ?? self::current()) {
            'en' => "{$baseUrl}/en",
            'ru' => "{$baseUrl}/ru",
            default => "{$baseUrl}/ge",
        };
    }
}
