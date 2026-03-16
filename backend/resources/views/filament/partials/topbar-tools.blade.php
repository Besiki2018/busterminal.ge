@php
    use App\Support\AdminContentLocale;

    $currentLocale = AdminContentLocale::current();
@endphp

<div class="bt-topbar-tools">
    <a
        href="{{ filament()->getHomeUrl() ?? url('/admin') }}"
        class="bt-topbar-icon-btn"
        title="ადმინის მთავარი"
        aria-label="ადმინის მთავარი"
    >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.75 12 3l8.25 6.75V19.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V9.75Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 21v-6h4.5v6" />
        </svg>
        <span class="bt-sr-only">ადმინის მთავარი</span>
    </a>

    <a
        href="{{ url('/admin/site-settings') }}"
        class="bt-topbar-icon-btn"
        title="საიტის პარამეტრები"
        aria-label="საიტის პარამეტრები"
    >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 4.5h3m-8.047 3.203 2.12-.879.878-2.12 2.25-.201 1.596 1.596 2.25-.2.878 2.12 2.12.879-.2 2.25 1.596 1.596-1.596 1.596.2 2.25-2.12.878-.879 2.12-2.25-.2-1.596 1.596-1.596-1.596-2.25.2-.878-2.12-2.12-.878.2-2.25-1.596-1.596 1.596-1.596-.2-2.25Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 12a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        <span class="bt-sr-only">საიტის პარამეტრები</span>
    </a>

    <a
        href="{{ AdminContentLocale::publicSiteUrl() }}"
        target="_blank"
        rel="noreferrer"
        class="bt-topbar-icon-btn"
        title="ვებსაიტის ნახვა"
        aria-label="ვებსაიტის ნახვა"
    >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 13.5V18A2.25 2.25 0 0 1 16.5 20.25H6A2.25 2.25 0 0 1 3.75 18V7.5A2.25 2.25 0 0 1 6 5.25h4.5" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 3.75h6.75V10.5M20.25 3.75l-9 9" />
        </svg>
        <span class="bt-sr-only">ვებსაიტის ნახვა</span>
    </a>

    <x-filament::dropdown placement="bottom-end" teleport>
        <x-slot name="trigger">
            <button
                type="button"
                class="bt-topbar-icon-btn bt-topbar-locale-btn"
                title="რედაქტირების ენა"
                aria-label="რედაქტირების ენა"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h7.5m-7.5 0L7.5 18m3-12L13.5 18m-9-7.5h9m-1.5 7.5h7.5" />
                </svg>
                <span class="bt-topbar-locale-indicator">{{ strtoupper($currentLocale) }}</span>
                <span class="bt-sr-only">რედაქტირების ენა</span>
            </button>
        </x-slot>

        <x-filament::dropdown.list>
            @foreach (AdminContentLocale::all() as $locale => $label)
                <x-filament::dropdown.list.item
                    tag="a"
                    href="{{ route('admin.content-locale', ['locale' => $locale]) }}"
                    :color="$currentLocale === $locale ? 'primary' : 'gray'"
                >
                    {{ $label }}
                </x-filament::dropdown.list.item>
            @endforeach
        </x-filament::dropdown.list>
    </x-filament::dropdown>
</div>
