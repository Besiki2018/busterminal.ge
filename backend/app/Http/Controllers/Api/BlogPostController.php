<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Support\CmsData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogPostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $posts = BlogPost::query()
            ->where('published', true)
            ->orderByDesc('published_at')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (BlogPost $post): array => CmsData::blogPost($post, $request->query('lang')))
            ->values()
            ->all();

        return response()->json($posts);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $post = BlogPost::query()
            ->where('slug', $slug)
            ->where('published', true)
            ->firstOrFail();

        return response()->json(CmsData::blogPost($post, $request->query('lang')));
    }
}
