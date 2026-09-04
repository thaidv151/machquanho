<?php

namespace App\Repositories;

use App\Models\Article;
use Illuminate\Support\Facades\Cache;

class ArticleRepository extends BaseRepository
{
    public function __construct(Article $model)
    {
        parent::__construct($model);
    }

    public function getPublicArticles(array $params): array
    {
        $query = $this->model->newQuery()->where('status', 'Đã đăng');

        if (!empty($params['category'])) {
            $query->where('category_name', $params['category']);
        }

        if (!empty($params['searchQuery'])) {
            $search = $params['searchQuery'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('excerpt', 'LIKE', "%{$search}%")
                  ->orWhere('author', 'LIKE', "%{$search}%");
            });
        }

        if (!empty($params['featured'])) {
            $query->where('featured', true);
        }

        return $query->orderBy('id', 'desc')->get()->toArray();
    }

    public function findByIdOrSlug(string|int $idOrSlug): Article
    {
        $article = $this->model->newQuery()
            ->where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();

        $article->increment('views');
        return $article;
    }

    public function getAdminArticles(array $params): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['keyword'])) {
            $keyword = $params['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('author', 'LIKE', "%{$keyword}%");
            });
        }

        if (!empty($params['category'])) {
            $query->where('category_name', $params['category']);
        }

        $articles = $query->orderBy('id', 'desc')->get();

        return [
            'data' => $articles,
            'total' => $articles->count(),
        ];
    }
}
