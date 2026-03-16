<x-filament-widgets::widget class="bt-dashboard-widget bt-dashboard-widget-hero">
    <div class="bt-dashboard-hero">
        <div>
            <div class="bt-dashboard-eyebrow">მთავარი გვერდი</div>
            <h2 class="bt-dashboard-title">მთავარი გვერდის კომპონენტები</h2>
            <p class="bt-dashboard-copy">
                მთავარ გვერდზე რაც უკვე ჩანს, აქ დაყოფილია ცალკე კომპონენტებად. დააჭირე შესაბამის ბლოკს და გაიხსნება მისი მართვის გვერდი, სადაც შეცვლი ტექსტს, ფოტოს, ჩანაწერებს და გამოჩენის რიგს.
            </p>
        </div>

        <div class="bt-hero-metrics">
            @foreach ($stats as $stat)
                <div class="bt-metric-card">
                    <span class="bt-metric-label">{{ $stat['label'] }}</span>
                    <strong class="bt-metric-value">{{ $stat['value'] }}</strong>
                </div>
            @endforeach
        </div>
    </div>

    <div class="bt-dashboard-section-block">
        <div class="bt-dashboard-section-head">
            <div>
                <div class="bt-dashboard-section-kicker">Homepage</div>
                <h3>კომპონენტების რედაქტირება</h3>
                <p>ყველა მთავარი სექცია ცალკე ბარათადაა გამოტანილი, რომ ზუსტად იმ ნაწილზე გადახვიდე რასაც არედაქტირებ.</p>
            </div>
        </div>

        <div class="bt-dashboard-component-grid">
            @foreach ($homepageComponents as $component)
                <a href="{{ $component['url'] }}" class="bt-component-card">
                    <div class="bt-component-card-top">
                        <span class="bt-component-chip">{{ $component['type'] }}</span>
                        <strong>{{ $component['countLabel'] }}</strong>
                    </div>
                    <div class="bt-component-card-body">
                        <h4>{{ $component['label'] }}</h4>
                        <p>{{ $component['description'] }}</p>
                    </div>
                    <div class="bt-component-card-bottom">
                        <span>{{ $component['cta'] }}</span>
                    </div>
                </a>
            @endforeach
        </div>
    </div>

    <div class="bt-dashboard-section-block bt-dashboard-section-block-compact">
        <div class="bt-dashboard-section-head">
            <div>
                <div class="bt-dashboard-section-kicker">Content</div>
                <h3>დამატებითი კონტენტი</h3>
                <p>სტატიკური გვერდები და ბლოგი გამოყავი ცალკე, რომ homepage-ის გარეთ დარჩენილი კონტენტიც სწრაფად მართო.</p>
            </div>
        </div>

        <div class="bt-dashboard-content-grid">
            @foreach ($contentAreas as $area)
                <a href="{{ $area['url'] }}" class="bt-content-card">
                    <div>
                        <h4>{{ $area['label'] }}</h4>
                        <p>{{ $area['description'] }}</p>
                    </div>
                    <strong>{{ $area['countLabel'] }}</strong>
                </a>
            @endforeach
        </div>
    </div>
</x-filament-widgets::widget>
