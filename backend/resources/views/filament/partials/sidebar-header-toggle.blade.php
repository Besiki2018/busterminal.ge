<button
    type="button"
    class="bt-sidebar-header-toggle"
    x-on:click="$store.sidebar.isOpen ? $store.sidebar.close() : $store.sidebar.open()"
    aria-label="გვერდითი მენიუს მართვა"
    title="გვერდითი მენიუს მართვა"
>
    <span x-cloak x-show="$store.sidebar.isOpen" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.75 9 12l5.25 5.25" />
        </svg>
    </span>

    <span x-cloak x-show="! $store.sidebar.isOpen" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 6.75 15 12l-5.25 5.25" />
        </svg>
    </span>
</button>
