<?php

namespace App\Repositories;

use App\Models\Article;
use App\Models\Category;
use App\Models\ResearchEntry;
use App\Models\MediaPost;

class SitemapRepository
{
    public function getPublishedArticles()
    {
        return Article::query()
            ->where('status', 'Đã đăng')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function getCategories()
    {
        return Category::query()
            ->orderBy('id', 'asc')
            ->get();
    }

    public function getResearchEntries()
    {
        return ResearchEntry::query()
            ->orderBy('id', 'desc')
            ->get();
    }

    public function getMediaPosts()
    {
        return MediaPost::query()
            ->where('status', 'published')
            ->orderBy('id', 'desc')
            ->get();
    }
}
