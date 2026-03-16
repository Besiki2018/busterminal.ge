<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->string('page_type')->default('custom');
            $table->string('route_path')->nullable();
            $table->string('seo_title_ka')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->string('seo_title_ru')->nullable();
            $table->text('seo_description_ka')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->text('seo_description_ru')->nullable();
            $table->text('seo_keywords_ka')->nullable();
            $table->text('seo_keywords_en')->nullable();
            $table->text('seo_keywords_ru')->nullable();
            $table->string('seo_image_url')->nullable();
            $table->boolean('noindex')->default(false);
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('seo_title_ka')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->string('seo_title_ru')->nullable();
            $table->text('seo_description_ka')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->text('seo_description_ru')->nullable();
            $table->text('seo_keywords_ka')->nullable();
            $table->text('seo_keywords_en')->nullable();
            $table->text('seo_keywords_ru')->nullable();
            $table->string('seo_image_url')->nullable();
            $table->boolean('noindex')->default(false);
        });

        Schema::table('partners', function (Blueprint $table) {
            $table->string('seo_title_ka')->nullable();
            $table->string('seo_title_en')->nullable();
            $table->string('seo_title_ru')->nullable();
            $table->text('seo_description_ka')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->text('seo_description_ru')->nullable();
            $table->text('seo_keywords_ka')->nullable();
            $table->text('seo_keywords_en')->nullable();
            $table->text('seo_keywords_ru')->nullable();
            $table->string('seo_image_url')->nullable();
            $table->boolean('noindex')->default(false);
        });

        DB::table('pages')->get()->each(function (object $page): void {
            DB::table('pages')
                ->where('id', $page->id)
                ->update([
                    'page_type' => 'custom',
                    'route_path' => "/page/{$page->slug}",
                    'seo_title_ka' => $page->title_ka,
                    'seo_title_en' => $page->title_en,
                    'seo_title_ru' => $page->title_ru,
                    'seo_description_ka' => $page->excerpt_ka,
                    'seo_description_en' => $page->excerpt_en,
                    'seo_description_ru' => $page->excerpt_ru,
                    'seo_image_url' => $page->cover_image_url,
                ]);
        });

        DB::table('blog_posts')->get()->each(function (object $post): void {
            DB::table('blog_posts')
                ->where('id', $post->id)
                ->update([
                    'seo_title_ka' => $post->title_ka,
                    'seo_title_en' => $post->title_en,
                    'seo_title_ru' => $post->title_ru,
                    'seo_description_ka' => $post->excerpt_ka,
                    'seo_description_en' => $post->excerpt_en,
                    'seo_description_ru' => $post->excerpt_ru,
                    'seo_image_url' => $post->cover_image_url,
                ]);
        });

        DB::table('partners')->get()->each(function (object $partner): void {
            DB::table('partners')
                ->where('id', $partner->id)
                ->update([
                    'seo_title_ka' => "{$partner->name} | სატრანსპორტო პარტნიორი | თბილისის ცენტრალური ავტოსადგური",
                    'seo_title_en' => "{$partner->name} | Transport Partner | Tbilisi Central Bus Terminal",
                    'seo_title_ru' => "{$partner->name} | Транспортный партнёр | Тбилисский центральный автовокзал",
                    'seo_description_ka' => $partner->description_ka,
                    'seo_description_en' => $partner->description_en,
                    'seo_description_ru' => $partner->description_ru,
                    'seo_keywords_ka' => "{$partner->name}, ავტობუსი, პარტნიორი, ბილეთები",
                    'seo_keywords_en' => "{$partner->name}, bus, partner, tickets",
                    'seo_keywords_ru' => "{$partner->name}, автобус, партнёр, билеты",
                    'seo_image_url' => $partner->logo_url,
                ]);
        });

        $now = now();

        foreach ($this->systemPages() as $page) {
            DB::table('pages')->updateOrInsert(
                ['slug' => $page['slug']],
                $page + [
                    'page_type' => 'system',
                    'published' => true,
                    'show_in_navigation' => false,
                    'cover_image_url' => $page['seo_image_url'] ?? null,
                    'sort_order' => $page['sort_order'] ?? 0,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }
    }

    public function down(): void
    {
        DB::table('pages')
            ->where('page_type', 'system')
            ->whereIn('slug', collect($this->systemPages())->pluck('slug'))
            ->delete();

        Schema::table('partners', function (Blueprint $table) {
            $table->dropColumn([
                'seo_title_ka',
                'seo_title_en',
                'seo_title_ru',
                'seo_description_ka',
                'seo_description_en',
                'seo_description_ru',
                'seo_keywords_ka',
                'seo_keywords_en',
                'seo_keywords_ru',
                'seo_image_url',
                'noindex',
            ]);
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropColumn([
                'seo_title_ka',
                'seo_title_en',
                'seo_title_ru',
                'seo_description_ka',
                'seo_description_en',
                'seo_description_ru',
                'seo_keywords_ka',
                'seo_keywords_en',
                'seo_keywords_ru',
                'seo_image_url',
                'noindex',
            ]);
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'page_type',
                'route_path',
                'seo_title_ka',
                'seo_title_en',
                'seo_title_ru',
                'seo_description_ka',
                'seo_description_en',
                'seo_description_ru',
                'seo_keywords_ka',
                'seo_keywords_en',
                'seo_keywords_ru',
                'seo_image_url',
                'noindex',
            ]);
        });
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function systemPages(): array
    {
        return [
            [
                'slug' => 'home',
                'route_path' => '/',
                'nav_label_ka' => 'მთავარი',
                'nav_label_en' => 'Home',
                'nav_label_ru' => 'Главная',
                'title_ka' => 'მთავარი გვერდი',
                'title_en' => 'Home Page',
                'title_ru' => 'Главная страница',
                'excerpt_ka' => 'თბილისის ცენტრალური ავტოსადგურის მთავარი გვერდის SEO პარამეტრები.',
                'excerpt_en' => 'SEO settings for the Tbilisi Central Bus Terminal homepage.',
                'excerpt_ru' => 'SEO-настройки главной страницы Тбилисского центрального автовокзала.',
                'content_ka' => '',
                'content_en' => '',
                'content_ru' => '',
                'seo_title_ka' => 'თბილისის ცენტრალური ავტოსადგური | შიდა და საერთაშორისო რეისები',
                'seo_title_en' => 'Tbilisi Central Bus Terminal | Domestic and International Routes',
                'seo_title_ru' => 'Тбилисский центральный автовокзал | внутренние и международные рейсы',
                'seo_description_ka' => 'შიდა და საერთაშორისო რეისები, ავტობუსების განრიგი, მიმართულებები და პარტნიორები თბილისის ცენტრალურ ავტოსადგურში.',
                'seo_description_en' => 'Domestic and international routes, bus schedules, destinations, and transport partners at Tbilisi Central Bus Terminal.',
                'seo_description_ru' => 'Внутренние и международные рейсы, расписание автобусов, направления и партнёры Тбилисского центрального автовокзала.',
                'seo_keywords_ka' => 'თბილისის ცენტრალური ავტოსადგური, ავტობუსები, რეისები, განრიგი, ბილეთები',
                'seo_keywords_en' => 'Tbilisi Central Bus Terminal, buses, routes, schedules, tickets',
                'seo_keywords_ru' => 'Тбилисский центральный автовокзал, автобусы, рейсы, расписание, билеты',
                'seo_image_url' => 'cms/gallery/terminal-exterior.jpg',
                'sort_order' => 1,
            ],
            [
                'slug' => 'about',
                'route_path' => '/about',
                'nav_label_ka' => 'ჩვენს შესახებ',
                'nav_label_en' => 'About',
                'nav_label_ru' => 'О нас',
                'title_ka' => 'ჩვენს შესახებ',
                'title_en' => 'About Us',
                'title_ru' => 'О нас',
                'excerpt_ka' => 'თბილისის ცენტრალური ავტოსადგურის ისტორია, ინფრასტრუქტურა და საქმიანობა.',
                'excerpt_en' => 'History, infrastructure, and operations of Tbilisi Central Bus Terminal.',
                'excerpt_ru' => 'История, инфраструктура и деятельность Тбилисского центрального автовокзала.',
                'content_ka' => '',
                'content_en' => '',
                'content_ru' => '',
                'seo_title_ka' => 'ჩვენს შესახებ | თბილისის ცენტრალური ავტოსადგური',
                'seo_title_en' => 'About Us | Tbilisi Central Bus Terminal',
                'seo_title_ru' => 'О нас | Тбилисский центральный автовокзал',
                'seo_description_ka' => 'გაიგე მეტი თბილისის ცენტრალური ავტოსადგურის ისტორიის, ინფრასტრუქტურის, სერვისებისა და განვითარების შესახებ.',
                'seo_description_en' => 'Learn more about the history, infrastructure, services, and development of Tbilisi Central Bus Terminal.',
                'seo_description_ru' => 'Узнайте больше об истории, инфраструктуре, услугах и развитии Тбилисского центрального автовокзала.',
                'seo_keywords_ka' => 'ჩვენს შესახებ, ისტორია, ავტოსადგური, თბილისი',
                'seo_keywords_en' => 'about us, terminal history, bus station, Tbilisi',
                'seo_keywords_ru' => 'о нас, история автовокзала, Тбилиси, автостанция',
                'seo_image_url' => 'cms/gallery/terminal-building.jpg',
                'sort_order' => 2,
            ],
            [
                'slug' => 'destinations',
                'route_path' => '/destinations',
                'nav_label_ka' => 'მიმართულებები',
                'nav_label_en' => 'Destinations',
                'nav_label_ru' => 'Направления',
                'title_ka' => 'მიმართულებები',
                'title_en' => 'Destinations',
                'title_ru' => 'Направления',
                'excerpt_ka' => 'შიდა და საერთაშორისო მიმართულებები თბილისის ცენტრალური ავტოსადგურიდან.',
                'excerpt_en' => 'Domestic and international destinations from Tbilisi Central Bus Terminal.',
                'excerpt_ru' => 'Внутренние и международные направления из Тбилисского центрального автовокзала.',
                'content_ka' => '',
                'content_en' => '',
                'content_ru' => '',
                'seo_title_ka' => 'მიმართულებები და ბილეთები | თბილისის ცენტრალური ავტოსადგური',
                'seo_title_en' => 'Destinations and Tickets | Tbilisi Central Bus Terminal',
                'seo_title_ru' => 'Направления и билеты | Тбилисский центральный автовокзал',
                'seo_description_ka' => 'იხილე შიდა და საერთაშორისო მიმართულებები, მგზავრობის ხანგრძლივობა, ფასები და ბილეთების ბმულები.',
                'seo_description_en' => 'Browse domestic and international destinations, travel duration, prices, and ticket links.',
                'seo_description_ru' => 'Смотрите внутренние и международные направления, длительность поездки, цены и ссылки на билеты.',
                'seo_keywords_ka' => 'მიმართულებები, ავტობუსის ბილეთები, საერთაშორისო რეისები, შიდა რეისები',
                'seo_keywords_en' => 'destinations, bus tickets, international routes, domestic routes',
                'seo_keywords_ru' => 'направления, автобусные билеты, международные рейсы, внутренние рейсы',
                'seo_image_url' => 'cms/gallery/terminal-interior.jpg',
                'sort_order' => 3,
            ],
            [
                'slug' => 'schedule',
                'route_path' => '/schedule',
                'nav_label_ka' => 'განრიგი',
                'nav_label_en' => 'Schedule',
                'nav_label_ru' => 'Расписание',
                'title_ka' => 'განრიგი',
                'title_en' => 'Schedule',
                'title_ru' => 'Расписание',
                'excerpt_ka' => 'რეისების განრიგი და ავტობუსების გასვლის დროები.',
                'excerpt_en' => 'Departure times and bus schedule information.',
                'excerpt_ru' => 'Время отправления и расписание автобусов.',
                'content_ka' => '',
                'content_en' => '',
                'content_ru' => '',
                'seo_title_ka' => 'რეისების განრიგი | თბილისის ცენტრალური ავტოსადგური',
                'seo_title_en' => 'Bus Schedule | Tbilisi Central Bus Terminal',
                'seo_title_ru' => 'Расписание рейсов | Тбилисский центральный автовокзал',
                'seo_description_ka' => 'შეამოწმე ავტობუსების გასვლის დროები და მიმდინარე განრიგი თბილისის ცენტრალური ავტოსადგურიდან.',
                'seo_description_en' => 'Check departure times and current bus schedules from Tbilisi Central Bus Terminal.',
                'seo_description_ru' => 'Проверьте время отправления и актуальное расписание автобусов Тбилисского центрального автовокзала.',
                'seo_keywords_ka' => 'განრიგი, გასვლის დრო, ავტობუსები, რეისები',
                'seo_keywords_en' => 'schedule, departure times, buses, routes',
                'seo_keywords_ru' => 'расписание, время отправления, автобусы, рейсы',
                'seo_image_url' => 'cms/gallery/terminal-exterior.jpg',
                'sort_order' => 4,
            ],
            [
                'slug' => 'partners',
                'route_path' => '/partners',
                'nav_label_ka' => 'პარტნიორები',
                'nav_label_en' => 'Partners',
                'nav_label_ru' => 'Партнёры',
                'title_ka' => 'პარტნიორები',
                'title_en' => 'Partners',
                'title_ru' => 'Партнёры',
                'excerpt_ka' => 'სანდო სატრანსპორტო პარტნიორები და მათი მიმართულებები.',
                'excerpt_en' => 'Trusted transport partners and their route coverage.',
                'excerpt_ru' => 'Надёжные транспортные партнёры и их направления.',
                'content_ka' => '',
                'content_en' => '',
                'content_ru' => '',
                'seo_title_ka' => 'სატრანსპორტო პარტნიორები | თბილისის ცენტრალური ავტოსადგური',
                'seo_title_en' => 'Transport Partners | Tbilisi Central Bus Terminal',
                'seo_title_ru' => 'Транспортные партнёры | Тбилисский центральный автовокзал',
                'seo_description_ka' => 'იხილე ავტოსადგურის პარტნიორი კომპანიები, მიმართულებები და ოფიციალური ვებსაიტები.',
                'seo_description_en' => 'Explore the terminal transport partners, their routes, and official websites.',
                'seo_description_ru' => 'Посмотрите транспортных партнёров терминала, их направления и официальные сайты.',
                'seo_keywords_ka' => 'პარტნიორები, ავტობუსის კომპანიები, ოფიციალური ვებსაიტი, ბილეთები',
                'seo_keywords_en' => 'partners, bus companies, official website, tickets',
                'seo_keywords_ru' => 'партнёры, автобусные компании, официальный сайт, билеты',
                'seo_image_url' => 'cms/partners/omnibus.png',
                'sort_order' => 5,
            ],
            [
                'slug' => 'leadership',
                'route_path' => '/leadership',
                'nav_label_ka' => 'ხელმძღვანელობა',
                'nav_label_en' => 'Leadership',
                'nav_label_ru' => 'Руководство',
                'title_ka' => 'ხელმძღვანელობა',
                'title_en' => 'Leadership',
                'title_ru' => 'Руководство',
                'excerpt_ka' => 'თბილისის ცენტრალური ავტოსადგურის მმართველი გუნდი.',
                'excerpt_en' => 'Leadership team of Tbilisi Central Bus Terminal.',
                'excerpt_ru' => 'Руководящая команда Тбилисского центрального автовокзала.',
                'content_ka' => '',
                'content_en' => '',
                'content_ru' => '',
                'seo_title_ka' => 'ხელმძღვანელობა | თბილისის ცენტრალური ავტოსადგური',
                'seo_title_en' => 'Leadership | Tbilisi Central Bus Terminal',
                'seo_title_ru' => 'Руководство | Тбилисский центральный автовокзал',
                'seo_description_ka' => 'გაიცანი თბილისის ცენტრალური ავტოსადგურის მმართველი გუნდი და პასუხისმგებელი პირები.',
                'seo_description_en' => 'Meet the leadership team and responsible contacts of Tbilisi Central Bus Terminal.',
                'seo_description_ru' => 'Познакомьтесь с руководящей командой и ответственными лицами Тбилисского центрального автовокзала.',
                'seo_keywords_ka' => 'ხელმძღვანელობა, მმართველი გუნდი, კონტაქტები',
                'seo_keywords_en' => 'leadership, management team, contacts',
                'seo_keywords_ru' => 'руководство, команда управления, контакты',
                'seo_image_url' => 'cms/gallery/terminal-building.jpg',
                'sort_order' => 6,
            ],
            [
                'slug' => 'contact',
                'route_path' => '/contact',
                'nav_label_ka' => 'კონტაქტი',
                'nav_label_en' => 'Contact',
                'nav_label_ru' => 'Контакты',
                'title_ka' => 'კონტაქტი',
                'title_en' => 'Contact',
                'title_ru' => 'Контакты',
                'excerpt_ka' => 'საკონტაქტო ინფორმაცია, მისამართი და სამუშაო საათები.',
                'excerpt_en' => 'Contact details, address, and working hours.',
                'excerpt_ru' => 'Контактная информация, адрес и часы работы.',
                'content_ka' => '',
                'content_en' => '',
                'content_ru' => '',
                'seo_title_ka' => 'კონტაქტი | თბილისის ცენტრალური ავტოსადგური',
                'seo_title_en' => 'Contact | Tbilisi Central Bus Terminal',
                'seo_title_ru' => 'Контакты | Тбилисский центральный автовокзал',
                'seo_description_ka' => 'იპოვე მისამართი, ტელეფონი, ელფოსტა და სამუშაო საათები თბილისის ცენტრალური ავტოსადგურისთვის.',
                'seo_description_en' => 'Find the address, phone, email, and working hours for Tbilisi Central Bus Terminal.',
                'seo_description_ru' => 'Найдите адрес, телефон, email и часы работы Тбилисского центрального автовокзала.',
                'seo_keywords_ka' => 'კონტაქტი, მისამართი, ტელეფონი, ელფოსტა, სამუშაო საათები',
                'seo_keywords_en' => 'contact, address, phone, email, working hours',
                'seo_keywords_ru' => 'контакты, адрес, телефон, email, часы работы',
                'seo_image_url' => 'cms/gallery/terminal-exterior.jpg',
                'sort_order' => 7,
            ],
            [
                'slug' => 'blog',
                'route_path' => '/blog',
                'nav_label_ka' => 'ბლოგი',
                'nav_label_en' => 'Blog',
                'nav_label_ru' => 'Блог',
                'title_ka' => 'ბლოგი',
                'title_en' => 'Blog',
                'title_ru' => 'Блог',
                'excerpt_ka' => 'სიახლეები და განახლებები თბილისის ცენტრალური ავტოსადგურიდან.',
                'excerpt_en' => 'News and updates from Tbilisi Central Bus Terminal.',
                'excerpt_ru' => 'Новости и обновления Тбилисского центрального автовокзала.',
                'content_ka' => '',
                'content_en' => '',
                'content_ru' => '',
                'seo_title_ka' => 'ბლოგი | თბილისის ცენტრალური ავტოსადგური',
                'seo_title_en' => 'Blog | Tbilisi Central Bus Terminal',
                'seo_title_ru' => 'Блог | Тбилисский центральный автовокзал',
                'seo_description_ka' => 'წაიკითხე სიახლეები, განცხადებები და განახლებები თბილისის ცენტრალური ავტოსადგურიდან.',
                'seo_description_en' => 'Read the latest news, announcements, and updates from Tbilisi Central Bus Terminal.',
                'seo_description_ru' => 'Читайте последние новости, объявления и обновления Тбилисского центрального автовокзала.',
                'seo_keywords_ka' => 'ბლოგი, სიახლეები, ავტოსადგური, განახლებები',
                'seo_keywords_en' => 'blog, news, terminal updates, announcements',
                'seo_keywords_ru' => 'блог, новости, обновления терминала, объявления',
                'seo_image_url' => 'cms/gallery/terminal-interior.jpg',
                'sort_order' => 8,
            ],
        ];
    }
};
