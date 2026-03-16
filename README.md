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
/opt/homebrew/opt/php@8.3/bin/php artisan serve --host=127.0.0.1 --port=8000
```

ან root-იდან:

```bash
cd /Users/besikiekseulidze/web-development/busterminal.ge
npm run backend:dev
```

## ძირითადი მისამართები

- Public site: `http://localhost:8080`
- Admin panel: `http://127.0.0.1:8000/admin`

## ბრენდინგი და SEO

- header logo: `public/brand/busterminal-logo.png`
- structured data logo: `public/brand/busterminal-logo.png`
- social preview image: `public/facebook-cover-banner.png`

## SEO შემოწმება ლოკალურად

`npm run dev` არის მხოლოდ development shell და `view-source`-ში route-specific SEO HTML არ გამოჩნდება.

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
