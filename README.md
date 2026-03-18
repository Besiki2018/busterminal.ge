# Buster Terminal

თბილისის ცენტრალური ავტოსადგურის ვებსაიტი და ადმინისტრაციული პანელი.

## სტრუქტურა

- `src/` - public React/Vite ფრონტი
- `backend/` - Laravel + Filament ადმინისტრაციული პანელი
- `public/brand/` - ბრენდირებული საჯარო asset-ები

## ლოკალური გაშვება

ფრონტი:

```bash
cd /Users/besikiekseulidze/web-development/busterminal.ge
npm install
npm run dev
```

ბექენდი:

```bash
cd /Users/besikiekseulidze/web-development/busterminal.ge/backend
php artisan serve --host=127.0.0.1 --port=8000
```

ან root-იდან:

```bash
cd /Users/besikiekseulidze/web-development/busterminal.ge
npm run backend:dev
```

თუ default `php` binary-ს `intl` extension არ აქვს, გაუშვი compatible PHP-ით:

```bash
export BUSTERTERMINAL_PHP_BINARY=/path/to/php
npm run backend:dev
```

## ძირითადი მისამართები

- Public site: `http://localhost:8080`
- Admin panel: `http://127.0.0.1:8000/admin`

## Production Env

სერვერზე ასატანად გამოიყენე ეს template-ები:

- frontend: [.env.production.example](/Users/besikiekseulidze/web-development/busterminal.ge/.env.production.example)
- backend: [backend/.env.production.example](/Users/besikiekseulidze/web-development/busterminal.ge/backend/.env.production.example)

ჩვეულებრივი flow:

```bash
cp .env.production.example .env.production
cp backend/.env.production.example backend/.env
```

შემდეგ ჩაასწორე:

- domain-ები: `VITE_SITE_URL`, `VITE_LARAVEL_URL`, `VITE_ADMIN_URL`, `APP_URL`, `FRONTEND_URL`
- MySQL: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- mail: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- cookie domain: `SESSION_DOMAIN`

`APP_KEY` ცარიელია განზრახ. სერვერზე ერთხელ გაუშვი:

```bash
cd backend
php artisan key:generate --force
```

## Production Deploy

რეკომენდებული განლაგება:

- `busterminal.ge` ემსახურება root-ის `dist/` დირექტორიას
- `cms.busterminal.ge` ემსახურება `backend/public/` დირექტორიას
- public frontend production-ზე უკავშირდება backend-ს `VITE_LARAVEL_URL` და `VITE_ADMIN_URL` ცვლადებით, ამიტომ ცალკე `/api` proxy აუცილებელი არ არის

მნიშვნელოვანი შენიშვნა:

- root-ის `npm run build` მხოლოდ frontend build არ არის. ის უშვებს `backend/artisan seo:export`-საც, ამიტომ build-ის დროს `backend/.env`, Composer dependencies და ბაზასთან წვდომა უკვე გამართული უნდა იყოს.

სერვერზე ასატანი მინიმალური sequence:

```bash
cd /path/to/busterminal.ge

# 1. backend
cp backend/.env.production.example backend/.env
cd backend
composer install --no-dev --optimize-autoloader
npm install
php artisan key:generate --force   # მხოლოდ პირველ deploy-ზე, თუ APP_KEY ცარიელია
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build

# 2. frontend
cd ..
cp .env.production.example .env.production
npm ci
npm run build
```

web server paths:

- frontend document root: `/path/to/busterminal.ge/dist`
- backend document root: `/path/to/busterminal.ge/backend/public`

თუ queue ან scheduler-ს გამოიყენებ production-ში, ცალკე პროცესად გაუშვი:

```bash
cd /path/to/busterminal.ge/backend
php artisan queue:work --tries=1
php artisan schedule:work
```

## ბრენდინგი და SEO

- header logo: `public/brand/busterminal-logo.png`
- structured data logo: `public/brand/busterminal-logo.png`
- social preview image: `public/facebook-cover-banner.png`

## SEO შემოწმება ლოკალურად

`npm run dev` ახლა უშვებს prerendered SEO preview-ს, ამიტომ `view-source`-ში route-specific SEO HTML გამოჩნდება.

თუ ოდესმე ისევ plain Vite SPA shell დაგჭირდება:

```bash
npm run dev:spa
```

თუ გინდა ზუსტად ის HTML ნახო, რასაც crawler-ები მიიღებენ:

```bash
cd /Users/besikiekseulidze/web-development/busterminal.ge
npm run seo:preview
```

ამის შემდეგ `http://127.0.0.1:8080/ge/partners/citybus` და სხვა public გვერდების `view-source` უკვე აჩვენებს:

- page-specific title/description/keywords
- canonical და hreflang
- Open Graph და Twitter meta
- JSON-LD structured data
- prerendered body content
