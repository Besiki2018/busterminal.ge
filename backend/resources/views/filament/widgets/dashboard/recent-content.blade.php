<x-filament-widgets::widget class="bt-dashboard-widget">
    <div class="bt-content-grid">
        <section class="bt-surface-card">
            <header class="bt-card-header">
                <div>
                    <h3>ბოლო გვერდები</h3>
                    <p>ბოლოს განახლებული სტატიკური გვერდები.</p>
                </div>
            </header>

            <div class="bt-card-list">
                @forelse ($pages as $page)
                    <div class="bt-list-item">
                        <div>
                            <strong>{{ $page->{\App\Support\AdminContentLocale::field('title')} }}</strong>
                            <span>/page/{{ $page->slug }}</span>
                        </div>
                        <time>{{ optional($page->updated_at)->diffForHumans() }}</time>
                    </div>
                @empty
                    <p class="bt-empty-state">გვერდები ჯერ არ დამატებულა.</p>
                @endforelse
            </div>
        </section>

        <section class="bt-surface-card">
            <header class="bt-card-header">
                <div>
                    <h3>ბოლო ბლოგ პოსტები</h3>
                    <p>უახლესი სარედაქციო აქტივობა.</p>
                </div>
            </header>

            <div class="bt-card-list">
                @forelse ($posts as $post)
                    <div class="bt-list-item">
                        <div>
                            <strong>{{ $post->{\App\Support\AdminContentLocale::field('title')} }}</strong>
                            <span>{{ $post->author_name }}</span>
                        </div>
                        <time>{{ optional($post->updated_at)->diffForHumans() }}</time>
                    </div>
                @empty
                    <p class="bt-empty-state">ბლოგ პოსტები ჯერ არ დამატებულა.</p>
                @endforelse
            </div>
        </section>

        <section class="bt-surface-card">
            <header class="bt-card-header">
                <div>
                    <h3>ხელით დამატებული განრიგები</h3>
                    <p>ბოლო ცვლილებები გასვლის ცხრილში.</p>
                </div>
            </header>

            <div class="bt-card-list">
                @forelse ($schedules as $schedule)
                    <div class="bt-list-item">
                        <div>
                            <strong>{{ $schedule->departure_time }}</strong>
                            <span>{{ $schedule->{\App\Support\AdminContentLocale::field('destination')} }} · {{ $schedule->operator }}</span>
                        </div>
                        <time>{{ optional($schedule->updated_at)->diffForHumans() }}</time>
                    </div>
                @empty
                    <p class="bt-empty-state">განრიგის ცვლილებები ჯერ არ დამატებულა.</p>
                @endforelse
            </div>
        </section>
    </div>
</x-filament-widgets::widget>
