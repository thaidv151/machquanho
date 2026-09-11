<?php

namespace App\Repositories;

use App\Models\MediaPost;

class MediaPostRepository extends BaseRepository
{
    public function __construct(MediaPost $model)
    {
        parent::__construct($model);
    }

    public function getFilteredPosts(array $params)
    {
        $query = $this->model->newQuery()->with('category');

        if (!empty($params['category_slug'])) {
            $categorySlug = $params['category_slug'];
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if (isset($params['is_featured']) && $params['is_featured'] !== null && $params['is_featured'] !== '') {
            $isFeatured = filter_var($params['is_featured'], FILTER_VALIDATE_BOOLEAN);
            $query->where('is_featured', $isFeatured);
        }

        if (!empty($params['keyword'])) {
            $keyword = $params['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('sub_title', 'LIKE', "%{$keyword}%")
                  ->orWhere('description', 'LIKE', "%{$keyword}%");
            });
        }

        $query->where('status', 'published')
              ->orderBy('is_featured', 'desc')
              ->orderBy('id', 'desc');

        $limit = isset($params['limit']) ? (int)$params['limit'] : 20;

        if (isset($params['page'])) {
            return $query->paginate($limit);
        }

        return $query->take($limit)->get();
    }

    public function getFeaturedToday()
    {
        // Get newest is_featured=true post, or fall back to most played/newest post
        $featured = $this->model->newQuery()
            ->with('category')
            ->where('status', 'published')
            ->where('is_featured', true)
            ->orderBy('id', 'desc')
            ->first();

        if (!$featured) {
            $featured = $this->model->newQuery()
                ->with('category')
                ->where('status', 'published')
                ->orderBy('play_count', 'desc')
                ->orderBy('id', 'desc')
                ->first();
        }

        return $featured;
    }

    public function findBySlug(string $slug)
    {
        return $this->model->newQuery()
            ->with('category')
            ->where('slug', $slug)
            ->first();
    }

    public function incrementPlayCount($id)
    {
        return $this->model->newQuery()->where('id', $id)->increment('play_count');
    }
}
