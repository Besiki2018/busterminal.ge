<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\CmsData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsController extends Controller
{
    public function homepage(Request $request): JsonResponse
    {
        return response()->json(CmsData::homepage($request->query('lang')));
    }
}
