<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SitemapService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SitemapController extends Controller
{
    public function __construct(protected SitemapService $sitemapService)
    {
    }

    public function sitemapXml()
    {
        try {
            $xml = $this->sitemapService->generateSitemapXml();

            return response($xml, 200)
                ->header('Content-Type', 'text/xml; charset=utf-8');
        } catch (\Throwable $e) {
            Log::error('SitemapController@sitemapXml error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo sitemap: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function robotsTxt()
    {
        try {
            $txt = $this->sitemapService->generateRobotsTxt();

            return response($txt, 200)
                ->header('Content-Type', 'text/plain; charset=utf-8');
        } catch (\Throwable $e) {
            Log::error('SitemapController@robotsTxt error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo robots.txt: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getUrls()
    {
        try {
            $urls = $this->sitemapService->getSitemapUrls();

            return response()->json([
                'status' => 'success',
                'total' => count($urls),
                'data' => $urls,
            ]);
        } catch (\Throwable $e) {
            Log::error('SitemapController@getUrls error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi lấy danh sách sitemap URL: ' . $e->getMessage(),
            ], 500);
        }
    }
}
