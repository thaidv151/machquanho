<?php

namespace App\Services;

use App\Repositories\ArticleRepository;
use App\Models\Article;
use Illuminate\Support\Str;

class ArticleService extends BaseService
{
    protected ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $articleRepository)
    {
        parent::__construct($articleRepository);
        $this->articleRepository = $articleRepository;
    }

    public function getPublicArticles(array $params): array
    {
        return $this->articleRepository->getPublicArticles($params);
    }

    public function getArticleByIdOrSlug(string|int $idOrSlug): Article
    {
        return $this->articleRepository->findByIdOrSlug($idOrSlug);
    }

    public function getAdminArticles(array $params): array
    {
        return $this->articleRepository->getAdminArticles($params);
    }

    public function createArticle(array $data): Article
    {
        $slug = Str::slug($data['title']) . '-' . time();
        $data['slug'] = $slug;
        $data['cover_image'] = $data['cover_image'] ?? $data['coverImage'] ?? null;
        $data['category_name'] = $data['category_name'] ?? $data['category'] ?? 'Sự kiện';

        return $this->articleRepository->create($data);
    }

    public function updateArticle(int|string $id, array $data): Article
    {
        $article = $this->articleRepository->findOrFail($id);

        if (isset($data['title']) && $data['title'] !== $article->title) {
            $data['slug'] = Str::slug($data['title']) . '-' . time();
        }

        if (isset($data['coverImage'])) {
            $data['cover_image'] = $data['coverImage'];
        }

        if (isset($data['category'])) {
            $data['category_name'] = $data['category'];
        }

        $article->update($data);
        return $article;
    }
}
