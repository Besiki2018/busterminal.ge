<?php

use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\CmsController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('/cms/homepage', [CmsController::class, 'homepage']);
Route::get('/pages/{slug}', [PageController::class, 'show']);
Route::get('/blog-posts', [BlogPostController::class, 'index']);
Route::get('/blog-posts/{slug}', [BlogPostController::class, 'show']);
Route::get('/schedules', [ScheduleController::class, 'index']);
