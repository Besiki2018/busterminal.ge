<?php

use App\Support\AdminContentLocale;
use Illuminate\Support\Facades\Route;

Route::get('/admin/content-locale/{locale}', function (string $locale) {
    AdminContentLocale::set($locale);

    return redirect()->back(fallback: url('/admin'));
})->name('admin.content-locale');

Route::redirect('/', '/admin');
