<?php

namespace App\Filament\Resources\SiteSettings\Pages;

use App\Filament\Resources\SiteSettings\SiteSettingResource;
use App\Models\SiteSetting;
use Filament\Resources\Pages\EditRecord;

class ManageSiteSettings extends EditRecord
{
    protected static string $resource = SiteSettingResource::class;

    protected static ?string $title = 'საიტის პარამეტრები';

    public function mount(int | string | null $record = null): void
    {
        $this->record = SiteSetting::query()->firstOrCreate(
            ['key' => 'primary'],
            ['key' => 'primary'],
        );

        $this->authorizeAccess();
        $this->fillForm();
        $this->previousUrl = url()->previous();
    }

    public function getBreadcrumb(): string
    {
        return 'საიტის პარამეტრები';
    }

    protected function getHeaderActions(): array
    {
        return [];
    }

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl();
    }
}
