<?php

namespace Tests\Feature\Admin;

use App\Models\BlogPost;
use App\Models\DestinationRoute;
use App\Models\LeadershipMember;
use App\Models\Page;
use App\Models\Partner;
use App\Models\ScheduleOverride;
use App\Models\User;
use App\Support\AdminContentLocale;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_the_custom_admin_login_page_loads(): void
    {
        $response = $this->get('/admin/login');

        $response->assertOk();
        $response->assertSee('კეთილი იყოს შენი დაბრუნება');
        $response->assertSee('Buster Terminal CMS');
    }

    public function test_an_admin_can_open_the_dashboard(): void
    {
        $user = User::query()->where('email', 'info@busterminal.ge')->firstOrFail();

        $response = $this->actingAs($user)->get('/admin');

        $response->assertOk();
        $response->assertSee('მთავარი გვერდის კომპონენტები');
        $response->assertSee('რედაქტირების ენა');
        $response->assertSee('ვებსაიტის ნახვა');
        $response->assertSee('ჰერო სექცია');
        $response->assertSee('ჩვენს შესახებ');
        $response->assertSee('მიმართულებები');
        $response->assertSee('განრიგი');
        $response->assertSee('პარტნიორები');
        $response->assertSee('ხელმძღვანელობა');
        $response->assertSee('კონტაქტი');
    }

    public function test_an_admin_can_switch_the_content_locale(): void
    {
        $user = User::query()->where('email', 'info@busterminal.ge')->firstOrFail();

        $response = $this->actingAs($user)->get('/admin/content-locale/en');

        $response->assertRedirect('/admin');
        $response->assertSessionHas(AdminContentLocale::SESSION_KEY, 'en');
    }

    public function test_site_settings_page_loads_with_parameter_shortcuts(): void
    {
        $user = User::query()->where('email', 'info@busterminal.ge')->firstOrFail();

        $response = $this->actingAs($user)->get('/admin/site-settings');

        $response->assertOk();
        $response->assertSee('საიტის ძირითადი პარამეტრები');
        $response->assertSee('კონტენტის თარგმანები');
    }

    public function test_homepage_single_section_pages_load(): void
    {
        $user = User::query()->where('email', 'info@busterminal.ge')->firstOrFail();

        $this->actingAs($user)
            ->get('/admin/homepage-components/hero')
            ->assertOk()
            ->assertSee('ჰერო სექცია');

        $this->actingAs($user)
            ->get('/admin/homepage-components/about')
            ->assertOk()
            ->assertSee('ჩვენს შესახებ');

        $this->actingAs($user)
            ->get('/admin/homepage-components/contact')
            ->assertOk()
            ->assertSee('კონტაქტი');

        $this->actingAs($user)
            ->get('/admin/homepage-components/footer')
            ->assertOk()
            ->assertSee('ფუთერი');
    }

    public function test_pages_resource_uses_dedicated_create_and_edit_pages(): void
    {
        $user = User::query()->where('email', 'info@busterminal.ge')->firstOrFail();
        $page = Page::query()->firstOrFail();

        $createResponse = $this->actingAs($user)->get('/admin/pages/create');
        $createResponse->assertOk();
        $createResponse->assertSee('გვერდის დამატება');

        $editResponse = $this->actingAs($user)->get("/admin/pages/{$page->getKey()}/edit");
        $editResponse->assertOk();
        $editResponse->assertSee('გვერდის რედაქტირება');
    }

    public function test_blog_resource_uses_dedicated_create_and_edit_pages(): void
    {
        $user = User::query()->where('email', 'info@busterminal.ge')->firstOrFail();
        $post = BlogPost::query()->firstOrFail();

        $createResponse = $this->actingAs($user)->get('/admin/blog-posts/create');
        $createResponse->assertOk();
        $createResponse->assertSee('ბლოგ პოსტის დამატება');

        $editResponse = $this->actingAs($user)->get("/admin/blog-posts/{$post->getKey()}/edit");
        $editResponse->assertOk();
        $editResponse->assertSee('ბლოგ პოსტის რედაქტირება');
    }

    public function test_homepage_collection_resources_use_dedicated_create_and_edit_pages(): void
    {
        $user = User::query()->where('email', 'info@busterminal.ge')->firstOrFail();
        $destinationRoute = DestinationRoute::query()->firstOrFail();
        $partner = Partner::query()->firstOrFail();
        $leader = LeadershipMember::query()->firstOrFail();
        $scheduleOverride = ScheduleOverride::query()->first() ?? ScheduleOverride::query()->create([
            'departure_time' => '06:00',
            'destination_ka' => 'ბათუმი',
            'destination_en' => 'Batumi',
            'destination_ru' => 'Батуми',
            'operator' => 'Omnibus',
            'buy_ticket_url' => 'https://omnibus.ge',
            'published' => true,
            'sort_order' => 1,
        ]);

        $this->actingAs($user)->get('/admin/destination-routes/create')
            ->assertOk()
            ->assertSee('მიმართულების დამატება');
        $this->actingAs($user)->get("/admin/destination-routes/{$destinationRoute->getKey()}/edit")
            ->assertOk()
            ->assertSee('მიმართულების რედაქტირება');

        $this->actingAs($user)->get('/admin/partners/create')
            ->assertOk()
            ->assertSee('პარტნიორის დამატება');
        $this->actingAs($user)->get("/admin/partners/{$partner->getKey()}/edit")
            ->assertOk()
            ->assertSee('პარტნიორის რედაქტირება');

        $this->actingAs($user)->get('/admin/leadership-members/create')
            ->assertOk()
            ->assertSee('ხელმძღვანელის დამატება');
        $this->actingAs($user)->get("/admin/leadership-members/{$leader->getKey()}/edit")
            ->assertOk()
            ->assertSee('ხელმძღვანელის რედაქტირება');

        $this->actingAs($user)->get('/admin/schedule-overrides/create')
            ->assertOk()
            ->assertSee('განრიგის ჩანაწერის დამატება');
        $this->actingAs($user)->get("/admin/schedule-overrides/{$scheduleOverride->getKey()}/edit")
            ->assertOk()
            ->assertSee('განრიგის ჩანაწერის რედაქტირება');
    }
}
