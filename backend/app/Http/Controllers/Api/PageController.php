<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Support\CmsData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function show(Request $request, string $slug): JsonResponse
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('published', true)
            ->firstOrFail();

        return response()->json(CmsData::page($page, $request->query('lang')));
    }
}
