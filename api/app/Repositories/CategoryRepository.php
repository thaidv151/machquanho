<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class CategoryRepository extends BaseRepository
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    public function getPublicCategories(): array
    {
        return $this->model->newQuery()->orderBy('id', 'asc')->get()->toArray();
    }

    public function getAdminCategories(array $params): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['keyword'])) {
            $keyword = $params['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'LIKE', "%{$keyword}%")
                  ->orWhere('slug', 'LIKE', "%{$keyword}%");
            });
        }

        $categories = $query->orderBy('id', 'desc')->get();

        return [
            'data' => $categories,
            'total' => $categories->count(),
        ];
    }
}
