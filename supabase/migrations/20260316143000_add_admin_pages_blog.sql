create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nav_label_en text not null,
  nav_label_ka text not null,
  nav_label_ru text not null,
  title_en text not null,
  title_ka text not null,
  title_ru text not null,
  excerpt_en text,
  excerpt_ka text,
  excerpt_ru text,
  content_en text not null default '',
  content_ka text not null default '',
  content_ru text not null default '',
  cover_image_url text,
  show_in_navigation boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ka text not null,
  title_ru text not null,
  excerpt_en text,
  excerpt_ka text,
  excerpt_ru text,
  content_en text not null default '',
  content_ka text not null default '',
  content_ru text not null default '',
  cover_image_url text,
  author_name text not null default 'Admin',
  published_at timestamptz not null default timezone('utc', now()),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_pages_updated_at on public.pages;
create trigger set_pages_updated_at
before update on public.pages
for each row
execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.pages enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "Users can read own admin record" on public.admin_users;
create policy "Users can read own admin record"
on public.admin_users
for select
using (user_id = auth.uid());

drop policy if exists "Published pages are public" on public.pages;
create policy "Published pages are public"
on public.pages
for select
using (published);

drop policy if exists "Published blog posts are public" on public.blog_posts;
create policy "Published blog posts are public"
on public.blog_posts
for select
using (published);

drop policy if exists "Admins manage section content" on public.section_content;
create policy "Admins manage section content"
on public.section_content
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage routes" on public.routes;
create policy "Admins manage routes"
on public.routes
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage partners" on public.partners;
create policy "Admins manage partners"
on public.partners
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage leadership members" on public.leadership_members;
create policy "Admins manage leadership members"
on public.leadership_members
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage schedule overrides" on public.schedule_overrides;
create policy "Admins manage schedule overrides"
on public.schedule_overrides
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage pages" on public.pages;
create policy "Admins manage pages"
on public.pages
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins manage blog posts" on public.blog_posts;
create policy "Admins manage blog posts"
on public.blog_posts
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins upload CMS media" on storage.objects;
create policy "Admins upload CMS media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'cms' and public.is_admin());

drop policy if exists "Admins update CMS media" on storage.objects;
create policy "Admins update CMS media"
on storage.objects
for update
to authenticated
using (bucket_id = 'cms' and public.is_admin())
with check (bucket_id = 'cms' and public.is_admin());

drop policy if exists "Admins delete CMS media" on storage.objects;
create policy "Admins delete CMS media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'cms' and public.is_admin());
