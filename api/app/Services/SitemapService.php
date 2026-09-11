<?php

namespace App\Services;

use App\Repositories\SitemapRepository;
use Illuminate\Support\Carbon;

class SitemapService
{
    public function __construct(protected SitemapRepository $sitemapRepository)
    {
    }

    public function generateSitemapXml(): string
    {
        $baseUrl = rtrim(config('app.url', 'https://machquanho.com'), '/');

        $articles = $this->sitemapRepository->getPublishedArticles();
        $categories = $this->sitemapRepository->getCategories();
        $researchEntries = $this->sitemapRepository->getResearchEntries();
        $mediaPosts = $this->sitemapRepository->getMediaPosts();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
        $xml .= 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" ';
        $xml .= 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";

        // Static Public Routes
        $staticRoutes = [
            ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => '/news', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['loc' => '/nghe-quan-ho', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['loc' => '/research-diary', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => '/timeline', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => '/map', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => '/about', 'priority' => '0.7', 'changefreq' => 'monthly'],
        ];

        $today = Carbon::now()->format('Y-m-d');

        foreach ($staticRoutes as $route) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars($baseUrl . $route['loc']) . "</loc>\n";
            $xml .= "    <lastmod>" . $today . "</lastmod>\n";
            $xml .= "    <changefreq>" . $route['changefreq'] . "</changefreq>\n";
            $xml .= "    <priority>" . $route['priority'] . "</priority>\n";
            $xml .= "  </url>\n";
        }

        // Published Articles Detail Pages
        foreach ($articles as $article) {
            $slugOrId = !empty($article->slug) ? $article->slug : $article->id;
            $url = $baseUrl . '/article/' . rawurlencode($slugOrId);
            $lastmod = $article->updated_at ? Carbon::parse($article->updated_at)->format('Y-m-d') : $today;

            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars($url) . "</loc>\n";
            $xml .= "    <lastmod>" . $lastmod . "</lastmod>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "    <priority>0.8</priority>\n";

            if (!empty($article->cover_image)) {
                $xml .= "    <image:image>\n";
                $xml .= "      <image:loc>" . htmlspecialchars($article->cover_image) . "</image:loc>\n";
                $xml .= "      <image:title>" . htmlspecialchars($article->title) . "</image:title>\n";
                $xml .= "    </image:image>\n";
            }

            $xml .= "  </url>\n";
        }

        // News Categories Filter Pages
        foreach ($categories as $cat) {
            if (!empty($cat->slug)) {
                $url = $baseUrl . '/news?category=' . rawurlencode($cat->name);
                $xml .= "  <url>\n";
                $xml .= "    <loc>" . htmlspecialchars($url) . "</loc>\n";
                $xml .= "    <lastmod>" . $today . "</lastmod>\n";
                $xml .= "    <changefreq>weekly</changefreq>\n";
                $xml .= "    <priority>0.7</priority>\n";
                $xml .= "  </url>\n";
            }
        }

        // Research Diary Entries
        foreach ($researchEntries as $entry) {
            $url = $baseUrl . '/research-diary?id=' . rawurlencode($entry->id);
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars($url) . "</loc>\n";
            $xml .= "    <lastmod>" . $today . "</lastmod>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "    <priority>0.7</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }

    public function generateRobotsTxt(): string
    {
        $baseUrl = rtrim(config('app.url', 'https://machquanho.com'), '/');

        $txt = "User-agent: *\n";
        $txt .= "Allow: /\n";
        $txt .= "Disallow: /admin\n";
        $txt .= "Disallow: /api/admin\n\n";
        $txt .= "Sitemap: " . $baseUrl . "/sitemap.xml\n";

        return $txt;
    }

    public function getSitemapUrls(): array
    {
        $baseUrl = rtrim(config('app.url', 'https://machquanho.com'), '/');
        $articles = $this->sitemapRepository->getPublishedArticles();
        $categories = $this->sitemapRepository->getCategories();

        $urls = [
            ['url' => $baseUrl . '/', 'title' => 'Trang chủ - Mạch Quan Họ', 'type' => 'Static'],
            ['url' => $baseUrl . '/news', 'title' => 'Tin tức & Hoạt động', 'type' => 'Static'],
            ['url' => $baseUrl . '/nghe-quan-ho', 'title' => 'Nghe Quan họ', 'type' => 'Static'],
            ['url' => $baseUrl . '/research-diary', 'title' => 'Nhật ký nghiên cứu', 'type' => 'Static'],
            ['url' => $baseUrl . '/timeline', 'title' => 'Dòng chảy Quan họ', 'type' => 'Static'],
            ['url' => $baseUrl . '/map', 'title' => 'Bản đồ di sản', 'type' => 'Static'],
            ['url' => $baseUrl . '/about', 'title' => 'Về chúng tôi', 'type' => 'Static'],
        ];

        foreach ($articles as $article) {
            $slugOrId = !empty($article->slug) ? $article->slug : $article->id;
            $urls[] = [
                'url' => $baseUrl . '/article/' . rawurlencode($slugOrId),
                'title' => $article->title,
                'type' => 'Bài viết (' . ($article->category_name ?? 'Tin tức') . ')',
            ];
        }

        return $urls;
    }
}
