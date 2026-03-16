create extension if not exists pgcrypto with schema extensions;

do $$
begin
  create type public.language_code as enum ('en', 'ka', 'ru');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.route_type as enum ('domestic', 'international');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.section_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  locale public.language_code not null,
  content jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (section_key, locale)
);

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  route_type public.route_type not null,
  city_en text not null,
  city_ka text not null,
  city_ru text not null,
  country_en text,
  country_ka text,
  country_ru text,
  duration text,
  price_from text,
  provider_links jsonb not null default '[]'::jsonb,
  show_in_footer boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (route_type, city_en)
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description_en text not null,
  description_ka text not null,
  description_ru text not null,
  routes_en text not null,
  routes_ka text not null,
  routes_ru text not null,
  website text not null,
  logo_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.leadership_members (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  role_key text not null,
  phone text not null,
  linkedin text,
  whatsapp_enabled boolean not null default true,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.schedule_overrides (
  id uuid primary key default gen_random_uuid(),
  departure_time time not null,
  destination_en text not null,
  destination_ka text not null,
  destination_ru text not null,
  operator text not null,
  buy_ticket_url text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_section_content_updated_at on public.section_content;
create trigger set_section_content_updated_at
before update on public.section_content
for each row
execute function public.set_updated_at();

drop trigger if exists set_routes_updated_at on public.routes;
create trigger set_routes_updated_at
before update on public.routes
for each row
execute function public.set_updated_at();

drop trigger if exists set_partners_updated_at on public.partners;
create trigger set_partners_updated_at
before update on public.partners
for each row
execute function public.set_updated_at();

drop trigger if exists set_leadership_members_updated_at on public.leadership_members;
create trigger set_leadership_members_updated_at
before update on public.leadership_members
for each row
execute function public.set_updated_at();

drop trigger if exists set_schedule_overrides_updated_at on public.schedule_overrides;
create trigger set_schedule_overrides_updated_at
before update on public.schedule_overrides
for each row
execute function public.set_updated_at();

alter table public.section_content enable row level security;
alter table public.routes enable row level security;
alter table public.partners enable row level security;
alter table public.leadership_members enable row level security;
alter table public.schedule_overrides enable row level security;

drop policy if exists "Published section content is public" on public.section_content;
create policy "Published section content is public"
on public.section_content
for select
using (published);

drop policy if exists "Published routes are public" on public.routes;
create policy "Published routes are public"
on public.routes
for select
using (published);

drop policy if exists "Published partners are public" on public.partners;
create policy "Published partners are public"
on public.partners
for select
using (published);

drop policy if exists "Published leadership members are public" on public.leadership_members;
create policy "Published leadership members are public"
on public.leadership_members
for select
using (published);

drop policy if exists "Published schedule overrides are public" on public.schedule_overrides;
create policy "Published schedule overrides are public"
on public.schedule_overrides
for select
using (published);

insert into storage.buckets (id, name, public)
values ('cms', 'cms', true)
on conflict (id) do nothing;

drop policy if exists "CMS storage is public" on storage.objects;
create policy "CMS storage is public"
on storage.objects
for select
using (bucket_id = 'cms');

insert into public.section_content (section_key, locale, content)
values
  (
    'hero',
    'en',
    $json$
    {
      "badge": "Open 24/7 • Serving Since 1973",
      "title1": "Your Gateway to",
      "title2": "Georgia and Beyond",
      "description": "Over 50 years of connecting travelers across Georgia and beyond. Bus and microbus transportation to domestic and international destinations.",
      "location": "5 Gulia St, Tbilisi 0114, Georgia",
      "stats": [
        { "value": "50+", "label": "Years of Service" },
        { "value": "100+", "label": "Daily Departures" },
        { "value": "25+", "label": "Destinations" },
        { "value": "500K+", "label": "Passengers Annually" }
      ]
    }
    $json$::jsonb
  ),
  (
    'hero',
    'ka',
    $json$
    {
      "badge": "24/7 • გემსახურებით 1973 წლიდან",
      "title1": "შენი გზა მთელს საქართველოში",
      "title2": "და საზღვრებს გარეთ",
      "description": "50 წელზე მეტი თქვენს სამსახურში. ავტობუსებით და მიკროავტობუსებით შიდა და საერთაშორისო მიმართულებებით მგზავრობა.",
      "location": "გულიას ქ. 5, თბილისი 0114, საქართველო",
      "stats": [
        { "value": "50+", "label": "წელი შენს სამსახურში" },
        { "value": "100+", "label": "ყოველდღიური რეისები" },
        { "value": "25+", "label": "მიმართულება" },
        { "value": "500K+", "label": "მგზავრი წელიწადში" }
      ]
    }
    $json$::jsonb
  ),
  (
    'hero',
    'ru',
    $json$
    {
      "badge": "Открыто 24/7 • С 1973 года",
      "title1": "Ваш путь по Грузии",
      "title2": "и за ее пределами",
      "description": "Более 50 лет соединяем пассажиров по Грузии и за ее пределами. Автобусные и микроавтобусные рейсы по внутренним и международным направлениям.",
      "location": "ул. Гулия 5, Тбилиси 0114, Грузия",
      "stats": [
        { "value": "50+", "label": "Лет работы" },
        { "value": "100+", "label": "Рейсов в день" },
        { "value": "25+", "label": "Направлений" },
        { "value": "500K+", "label": "Пассажиров в год" }
      ]
    }
    $json$::jsonb
  ),
  (
    'about',
    'en',
    $json$
    {
      "badge": "About Us",
      "title1": "Tbilisi Central",
      "title2": "Bus Terminal",
      "description": "In 1973, a new complex of Tbilisi Central Bus Terminal was realized in Ortachala by Shota Kavlashvili, Ramaz Kiknadze and Vladimer Kurtishvili. The terminal is located in the south-eastern part of Tbilisi, nearby of Gulia Square and Aqueduct Bridge. Here passes the main highway, connecting Tbilisi to Rustavi, on which domestic as well as neighboring countries traffic flows.",
      "stats": [
        { "value": "1973", "label": "Established" },
        { "value": "24/7", "label": "Operations" },
        { "value": "500K+", "label": "Yearly Passengers" },
        { "value": "3.5", "label": "Hectares" }
      ]
    }
    $json$::jsonb
  ),
  (
    'about',
    'ka',
    $json$
    {
      "badge": "ჩვენს შესახებ",
      "title1": "თბილისი ცენტრალური",
      "title2": "ავტოსადგური",
      "description": "თბილისის ცენტრალური ავტოსადგური გაიხსნა 1973 წელს. ახალი კომპლექსი შოთა ქავლაშვილის, რამაზ კიკნაძისა და ვლადიმერ კურტიშვილის მიერ დაპროექტდა. ტერმინალი მდებარეობს თბილისის სამხრეთ-აღმოსავლეთ ნაწილში, გულიას მოედნისა და აკვედუკის ხიდის მახლობლად.",
      "stats": [
        { "value": "1973", "label": "დაარსდა" },
        { "value": "24/7", "label": "მუშაობა" },
        { "value": "500K+", "label": "მგზავრი წელიწადში" },
        { "value": "3.5", "label": "ჰექტარი" }
      ]
    }
    $json$::jsonb
  ),
  (
    'about',
    'ru',
    $json$
    {
      "badge": "О нас",
      "title1": "Тбилисский центральный",
      "title2": "автовокзал",
      "description": "Тбилисский центральный автовокзал был открыт в 1973 году. Новый комплекс был спроектирован Шота Кавлашвили, Рамазом Кикнадзе и Владимиром Куртишвили. Терминал расположен в юго-восточной части Тбилиси, рядом с площадью Гулия и Акведукским мостом.",
      "stats": [
        { "value": "1973", "label": "Основан" },
        { "value": "24/7", "label": "Режим работы" },
        { "value": "500K+", "label": "Пассажиров в год" },
        { "value": "3.5", "label": "Гектара" }
      ]
    }
    $json$::jsonb
  ),
  (
    'contact',
    'en',
    $json$
    {
      "badge": "Contact Us",
      "title1": "Get in",
      "title2": " Touch",
      "description": "We would love to hear from you. Feel free to reach out using the details below.",
      "addressLabel": "Address",
      "addressValue": "5 Gulia St, Tbilisi 0114, Georgia",
      "addressNote": "Ortachala, near Gulia Square",
      "phoneLabel": "Phone",
      "phone": "+995 596 10 22 22",
      "emailLabel": "Email",
      "email": "info@busterminal.ge",
      "hoursLabel": "Working Hours",
      "terminalLabel": "Terminal",
      "terminalHours": "24/7",
      "infoDeskLabel": "Information Desk",
      "infoDeskHours": "06:00 - 22:00",
      "followUsLabel": "Follow Us",
      "facebookUrl": "https://www.facebook.com/TBILISIBUSTERMINAL",
      "instagramUrl": "https://www.instagram.com/tbilisibusterminal"
    }
    $json$::jsonb
  ),
  (
    'contact',
    'ka',
    $json$
    {
      "badge": "კონტაქტი",
      "title1": "დაგვი",
      "title2": "კავშირდით",
      "description": "სიამოვნებით მოგისმენთ. დაგვიკავშირდით ქვემოთ მოცემული საშუალებებით.",
      "addressLabel": "მისამართი",
      "addressValue": "გულიას ქ. 5, თბილისი 0114, საქართველო",
      "addressNote": "ორთაჭალა, გულიას მოედანთან",
      "phoneLabel": "ტელეფონი",
      "phone": "+995 596 10 22 22",
      "emailLabel": "ელ-ფოსტა",
      "email": "info@busterminal.ge",
      "hoursLabel": "სამუშაო საათები",
      "terminalLabel": "ტერმინალი",
      "terminalHours": "24/7",
      "infoDeskLabel": "ინფორმაციის სამსახური",
      "infoDeskHours": "06:00 - 22:00",
      "followUsLabel": "გამოგვყევით",
      "facebookUrl": "https://www.facebook.com/TBILISIBUSTERMINAL",
      "instagramUrl": "https://www.instagram.com/tbilisibusterminal"
    }
    $json$::jsonb
  ),
  (
    'contact',
    'ru',
    $json$
    {
      "badge": "Контакты",
      "title1": "Свяжитесь",
      "title2": " с нами",
      "description": "Мы будем рады вашему сообщению. Используйте контакты ниже.",
      "addressLabel": "Адрес",
      "addressValue": "ул. Гулия 5, Тбилиси 0114, Грузия",
      "addressNote": "Ортачала, рядом с площадью Гулия",
      "phoneLabel": "Телефон",
      "phone": "+995 596 10 22 22",
      "emailLabel": "Эл. почта",
      "email": "info@busterminal.ge",
      "hoursLabel": "Часы работы",
      "terminalLabel": "Терминал",
      "terminalHours": "24/7",
      "infoDeskLabel": "Справочная",
      "infoDeskHours": "06:00 - 22:00",
      "followUsLabel": "Мы в соцсетях",
      "facebookUrl": "https://www.facebook.com/TBILISIBUSTERMINAL",
      "instagramUrl": "https://www.instagram.com/tbilisibusterminal"
    }
    $json$::jsonb
  ),
  (
    'footer',
    'en',
    $json$
    {
      "brandTitle": "TBILISI",
      "brandSubtitle": "Central Bus Terminal",
      "description": "Connecting Georgia since 1973. Your trusted partner for safe and comfortable travel across the country and beyond.",
      "privacyLabel": "Privacy Policy",
      "termsLabel": "Terms of Service",
      "popularRoutes": ["Tbilisi - Batumi", "Tbilisi - Kutaisi", "Tbilisi - Zugdidi", "Tbilisi - Mestia", "Tbilisi - Istanbul"]
    }
    $json$::jsonb
  ),
  (
    'footer',
    'ka',
    $json$
    {
      "brandTitle": "TBILISI",
      "brandSubtitle": "Central Bus Terminal",
      "description": "საქართველოს დაკავშირება 1973 წლიდან. თქვენი სანდო პარტნიორი უსაფრთხო და კომფორტული მოგზაურობისთვის.",
      "privacyLabel": "კონფიდენციალურობა",
      "termsLabel": "მომსახურების პირობები",
      "popularRoutes": ["თბილისი - ბათუმი", "თბილისი - ქუთაისი", "თბილისი - ზუგდიდი", "თბილისი - მესტია", "თბილისი - სტამბული"]
    }
    $json$::jsonb
  ),
  (
    'footer',
    'ru',
    $json$
    {
      "brandTitle": "TBILISI",
      "brandSubtitle": "Central Bus Terminal",
      "description": "Соединяем Грузию с 1973 года. Ваш надежный партнер для безопасных и комфортных поездок по стране и за ее пределами.",
      "privacyLabel": "Политика конфиденциальности",
      "termsLabel": "Условия использования",
      "popularRoutes": ["Тбилиси - Батуми", "Тбилиси - Кутаиси", "Тбилиси - Зугдиди", "Тбилиси - Местия", "Тбилиси - Стамбул"]
    }
    $json$::jsonb
  )
on conflict (section_key, locale) do update
set
  content = excluded.content,
  published = true;

insert into public.routes (
  route_type,
  city_en,
  city_ka,
  city_ru,
  country_en,
  country_ka,
  country_ru,
  duration,
  price_from,
  provider_links,
  show_in_footer,
  sort_order
)
values
  ('domestic', 'Batumi', 'ბათუმი', 'Батуми', null, null, null, '5-6h', '35 GEL', '[{"name":"Metro Georgia","url":"https://metrogeorgia.ge"},{"name":"Omnibus","url":"https://omnibusexpress.ge"},{"name":"CityBus","url":"https://citybus.ge"}]'::jsonb, true, 10),
  ('domestic', 'Kutaisi', 'ქუთაისი', 'Кутаиси', null, null, null, '3-4h', '18 GEL', '[{"name":"Omnibus","url":"https://omnibusexpress.ge"},{"name":"CityBus","url":"https://citybus.ge"},{"name":"Metro Georgia","url":"https://metrogeorgia.ge"}]'::jsonb, true, 20),
  ('domestic', 'Zugdidi', 'ზუგდიდი', 'Зугдиди', null, null, null, '5-6h', '30 GEL', '[{"name":"Omnibus","url":"https://omnibusexpress.ge"},{"name":"Metro Georgia","url":"https://metrogeorgia.ge"}]'::jsonb, true, 30),
  ('domestic', 'Kakheti', 'კახეთი', 'Кахети', null, null, null, '2h', '12 GEL', '[{"name":"TKT.ge","url":"https://tkt.ge/ortachala"}]'::jsonb, false, 40),
  ('domestic', 'Borjomi', 'ბორჯომი', 'Боржоми', null, null, null, '2.5h', '15 GEL', '[{"name":"TKT.ge","url":"https://tkt.ge/ortachala"}]'::jsonb, false, 50),
  ('domestic', 'Other domestic routes', 'სხვა შიდა მარშრუტები', 'Другие внутренние маршруты', null, null, null, null, null, '[{"name":"TKT.ge","url":"https://tkt.ge/ortachala"}]'::jsonb, false, 60),
  ('international', 'Istanbul', 'სტამბული', 'Стамбул', 'Turkey', 'თურქეთი', 'Турция', '18h', '120 GEL', '[{"name":"Luks Karadeniz","url":"https://lukskaradeniz.com"},{"name":"Metro Georgia","url":"https://metrogeorgia.ge"},{"name":"Obilet","url":"https://obilet.com"}]'::jsonb, true, 110),
  ('international', 'Ankara', 'ანკარა', 'Анкара', 'Turkey', 'თურქეთი', 'Турция', '20h', '150 GEL', '[{"name":"Luks Karadeniz","url":"https://lukskaradeniz.com"},{"name":"Metro Georgia","url":"https://metrogeorgia.ge"},{"name":"Obilet","url":"https://obilet.com"}]'::jsonb, false, 120),
  ('international', 'Antalya', 'ანტალია', 'Анталья', 'Turkey', 'თურქეთი', 'Турция', '24h', '180 GEL', '[{"name":"Luks Karadeniz","url":"https://lukskaradeniz.com"},{"name":"Obilet","url":"https://obilet.com"}]'::jsonb, false, 130),
  ('international', 'Izmir', 'იზმირი', 'Измир', 'Turkey', 'თურქეთი', 'Турция', '22h', '160 GEL', '[{"name":"Metro Georgia","url":"https://metrogeorgia.ge"},{"name":"Obilet","url":"https://obilet.com"}]'::jsonb, false, 140),
  ('international', 'Yerevan', 'ერევანი', 'Ереван', 'Armenia', 'სომხეთი', 'Армения', '5h', '35 GEL', '[{"name":"TKT.ge","url":"https://tkt.ge/ortachala"}]'::jsonb, false, 150),
  ('international', 'Gyumri', 'გიუმრი', 'Гюмри', 'Armenia', 'სომხეთი', 'Армения', '4h', '30 GEL', '[{"name":"TKT.ge","url":"https://tkt.ge/ortachala"}]'::jsonb, false, 160),
  ('international', 'Moscow', 'მოსკოვი', 'Москва', 'Russia', 'რუსეთი', 'Россия', '36h', '200 GEL', '[{"name":"TKT.ge","url":"https://tkt.ge/ortachala"}]'::jsonb, false, 170),
  ('international', 'Vladikavkaz', 'ვლადიკავკაზი', 'Владикавказ', 'Russia', 'რუსეთი', 'Россия', '4h', '40 GEL', '[{"name":"TKT.ge","url":"https://tkt.ge/ortachala"}]'::jsonb, false, 180),
  ('international', 'Samara', 'სამარა', 'Самара', 'Russia', 'რუსეთი', 'Россия', '30h', '180 GEL', '[{"name":"TKT.ge","url":"https://tkt.ge/ortachala"}]'::jsonb, false, 190),
  ('international', 'Other international routes', 'სხვა საერთაშორისო მარშრუტები', 'Другие международные маршруты', null, null, null, null, null, '[{"name":"TKT.ge","url":"https://tkt.ge/ortachala"}]'::jsonb, false, 200)
on conflict (route_type, city_en) do update
set
  city_ka = excluded.city_ka,
  city_ru = excluded.city_ru,
  country_en = excluded.country_en,
  country_ka = excluded.country_ka,
  country_ru = excluded.country_ru,
  duration = excluded.duration,
  price_from = excluded.price_from,
  provider_links = excluded.provider_links,
  show_in_footer = excluded.show_in_footer,
  sort_order = excluded.sort_order,
  published = true;

insert into public.partners (
  name,
  description_en,
  description_ka,
  description_ru,
  routes_en,
  routes_ka,
  routes_ru,
  website,
  sort_order
)
values
  ('Omnibus', 'Reliable, comfortable, and efficient bus services to various destinations.', 'საიმედო, კომფორტული და ეფექტური ავტობუსის მომსახურება სხვადასხვა მიმართულებით.', 'Надежные, комфортные и эффективные автобусные рейсы в различные направления.', 'Kutaisi, Batumi, Zugdidi', 'ქუთაისი, ბათუმი, ზუგდიდი', 'Кутаиси, Батуми, Зугдиди', 'https://omnibusexpress.ge/', 10),
  ('CityBus', 'Reliable, comfortable, and efficient bus services to various destinations.', 'საიმედო, კომფორტული და ეფექტური ავტობუსის მომსახურება სხვადასხვა მიმართულებით.', 'Надежные, комфортные и эффективные автобусные рейсы в различные направления.', 'Batumi, Kutaisi', 'ბათუმი, ქუთაისი', 'Батуми, Кутаиси', 'https://citybus.ge', 20),
  ('Metro Georgia', 'Reliable, comfortable, and efficient bus services to various destinations.', 'საიმედო, კომფორტული და ეფექტური ავტობუსის მომსახურება სხვადასხვა მიმართულებით.', 'Надежные, комфортные и эффективные автобусные рейсы в различные направления.', 'Batumi, Kutaisi, Zugdidi, Istanbul, Izmir', 'ბათუმი, ქუთაისი, ზუგდიდი, სტამბული, იზმირი', 'Батуми, Кутаиси, Зугдиди, Стамбул, Измир', 'https://www.metrogeorgia.ge/', 30),
  ('Luks Karadeniz', 'International routes with reliable, comfortable, and efficient service.', 'საერთაშორისო მარშრუტები საიმედო, კომფორტული და ეფექტური მომსახურებით.', 'Международные маршруты с надежным, комфортным и эффективным обслуживанием.', 'Istanbul, Ankara, Trabzon', 'სტამბული, ანკარა, ტრაბზონი', 'Стамбул, Анкара, Трабзон', 'https://lukskaradeniz.com/', 40),
  ('Long Way', 'Comfortable travel to Armenia and beyond.', 'კომფორტული მოგზაურობა სომხეთში და მის ფარგლებს გარეთ.', 'Комфортные путешествия в Армению и далее.', 'Yerevan, Gyumri', 'ერევანი, გიუმრი', 'Ереван, Гюмри', 'https://longway.ge/', 50),
  ('TKT.ge', 'Selected domestic and international route tickets.', 'შერჩეული შიდა და საერთაშორისო მარშრუტების ბილეთები.', 'Билеты на избранные внутренние и международные маршруты.', 'Kakheti, Borjomi, Moscow, Vladikavkaz, Yerevan, Gyumri and many more', 'კახეთი, ბორჯომი, მოსკოვი, ვლადიკავკაზი, ერევანი, გიუმრი და სხვა', 'Кахетия, Боржоми, Москва, Владикавказ, Ереван, Гюмри и многое другое', 'https://www.tkt.ge/ortachala', 60)
on conflict (name) do update
set
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  description_ru = excluded.description_ru,
  routes_en = excluded.routes_en,
  routes_ka = excluded.routes_ka,
  routes_ru = excluded.routes_ru,
  website = excluded.website,
  sort_order = excluded.sort_order,
  published = true;

insert into public.leadership_members (
  name,
  role_key,
  phone,
  linkedin,
  whatsapp_enabled,
  sort_order
)
values
  ('Giorgi Suladze', 'chairman', '+995 591 52 25 25', 'https://www.linkedin.com/in/giorgisuladze', true, 10),
  ('Merab Machavariani', 'deputyChairman', '+995 599 96 10 10', 'https://www.linkedin.com/in/merab-machavariani-046a46376', true, 20),
  ('Temur Jamrishvili', 'ceo', '+995 599 17 24 95', null, true, 30),
  ('Konstantine Rusadze', 'deputyCeo', '+995 577 58 23 23', null, true, 40),
  ('Nick Shonia', 'coo', '+995 597 12 32 25', 'https://www.linkedin.com/in/nick-shonia-2209b434/', true, 50),
  ('Nana Sturua', 'chiefAccountant', '+995 555 17 45 55', null, true, 60)
on conflict (name) do update
set
  role_key = excluded.role_key,
  phone = excluded.phone,
  linkedin = excluded.linkedin,
  whatsapp_enabled = excluded.whatsapp_enabled,
  sort_order = excluded.sort_order,
  published = true;
