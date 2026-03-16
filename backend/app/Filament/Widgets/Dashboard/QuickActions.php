<?php

namespace App\Filament\Widgets\Dashboard;

use App\Filament\Pages\HomepageSections\EditAboutSection;
use App\Filament\Pages\HomepageSections\EditContactSection;
use App\Filament\Pages\HomepageSections\EditFooterSection;
use App\Filament\Pages\HomepageSections\EditHeroSection;
use App\Filament\Resources\BlogPosts\BlogPostResource;
use App\Filament\Resources\DestinationRoutes\DestinationRouteResource;
use App\Filament\Resources\LeadershipMembers\LeadershipMemberResource;
use App\Filament\Resources\Pages\PageResource;
use App\Filament\Resources\Partners\PartnerResource;
use App\Filament\Resources\ScheduleOverrides\ScheduleOverrideResource;
use App\Models\BlogPost;
use App\Models\DestinationRoute;
use App\Models\LeadershipMember;
use App\Models\Page;
use App\Models\Partner;
use App\Models\ScheduleOverride;
use Filament\Widgets\Widget;

class QuickActions extends Widget
{
    protected static bool $isLazy = false;

    protected static ?int $sort = 2;

    protected string $view = 'filament.widgets.dashboard.quick-actions';

    protected int | string | array $columnSpan = 'full';

    protected function getViewData(): array
    {
        return [
            'stats' => [
                ['label' => 'მთავარი სექციები', 'value' => 8],
                ['label' => 'მიმართულებები', 'value' => DestinationRoute::query()->count()],
                ['label' => 'პარტნიორები', 'value' => Partner::query()->count()],
                ['label' => 'ბლოგ პოსტები', 'value' => BlogPost::query()->count()],
            ],
            'homepageComponents' => [
                [
                    'label' => 'ჰერო სექცია',
                    'description' => 'მართე პირველი ეკრანის სათაურები, ბეიჯი, ლოკაცია და სტატისტიკა.',
                    'type' => 'ერთი სექცია',
                    'countLabel' => 'მთავარი ბლოკი',
                    'url' => EditHeroSection::getUrl(),
                    'cta' => 'რედაქტირება',
                ],
                [
                    'label' => 'ჩვენს შესახებ',
                    'description' => 'განაახლე ტექსტები, სტატისტიკა, გალერეა და უპირატესობები.',
                    'type' => 'ტექსტი და ფოტოები',
                    'countLabel' => 'გალერეა + სთორი',
                    'url' => EditAboutSection::getUrl(),
                    'cta' => 'გახსენი ედიტი',
                ],
                [
                    'label' => 'მიმართულებები',
                    'description' => 'აკონტროლე შიდა და საერთაშორისო მარშრუტები, ფასები და პროვაიდერები.',
                    'type' => 'კოლექცია',
                    'countLabel' => DestinationRoute::query()->count() . ' ჩანაწერი',
                    'url' => DestinationRouteResource::getUrl(),
                    'cta' => 'მართე ჩანაწერები',
                ],
                [
                    'label' => 'განრიგი',
                    'description' => 'დაამატე ხელით override-ები და საჭიროების შემთხვევაში ჩაანაცვლე fallback განრიგი.',
                    'type' => 'კოლექცია',
                    'countLabel' => ScheduleOverride::query()->count() . ' ჩანაწერი',
                    'url' => ScheduleOverrideResource::getUrl(),
                    'cta' => 'გახსენი სია',
                ],
                [
                    'label' => 'პარტნიორები',
                    'description' => 'შეცვალე ლოგოები, ტექსტები, მარშრუტები და პარტნიორი კომპანიების რიგი.',
                    'type' => 'ფოტო და ტექსტი',
                    'countLabel' => Partner::query()->count() . ' ჩანაწერი',
                    'url' => PartnerResource::getUrl(),
                    'cta' => 'რედაქტირების გვერდი',
                ],
                [
                    'label' => 'ხელმძღვანელობა',
                    'description' => 'განაახლე გუნდის წევრები, პოზიციები, ტელეფონები და WhatsApp პარამეტრები.',
                    'type' => 'კოლექცია',
                    'countLabel' => LeadershipMember::query()->count() . ' ჩანაწერი',
                    'url' => LeadershipMemberResource::getUrl(),
                    'cta' => 'გახსენი გუნდი',
                ],
                [
                    'label' => 'კონტაქტი',
                    'description' => 'შეცვალე მისამართი, ტელეფონები, სამუშაო საათები და სოციალური ბმულები.',
                    'type' => 'ერთი სექცია',
                    'countLabel' => 'საკონტაქტო ბლოკი',
                    'url' => EditContactSection::getUrl(),
                    'cta' => 'რედაქტირება',
                ],
                [
                    'label' => 'ფუთერი',
                    'description' => 'მართე footer-ის ბრენდინგი, ტექსტები და პოპულარული მიმართულებები.',
                    'type' => 'ერთი სექცია',
                    'countLabel' => 'ქვედა ბლოკი',
                    'url' => EditFooterSection::getUrl(),
                    'cta' => 'გახსენი ფუთერი',
                ],
            ],
            'contentAreas' => [
                [
                    'label' => 'გვერდები',
                    'description' => 'დაამატე ახალი გვერდები და ნავიგაციის ჩანაწერები.',
                    'countLabel' => Page::query()->count() . ' გვერდი',
                    'url' => PageResource::getUrl(),
                ],
                [
                    'label' => 'ბლოგი',
                    'description' => 'გამოაქვეყნე სიახლეები, სტატიები და ქავერ სურათები.',
                    'countLabel' => BlogPost::query()->count() . ' პოსტი',
                    'url' => BlogPostResource::getUrl(),
                ],
            ],
        ];
    }
}
