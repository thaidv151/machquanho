<?php

namespace App\Repositories;

use App\Models\MapLocation;

class MapLocationRepository extends BaseRepository
{
    public function __construct(MapLocation $model)
    {
        parent::__construct($model);
    }

    public function getPublicLocations(?string $category = null): array
    {
        $query = $this->model->newQuery()->where('status', true);

        if (!empty($category) && $category !== 'Tất cả') {
            $query->where('category', $category);
        }

        return $query->orderBy('sort_order', 'asc')->orderBy('id', 'asc')->get()->toArray();
    }

    public function getAdminLocations(array $params): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['keyword'])) {
            $keyword = $params['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('address', 'LIKE', "%{$keyword}%")
                  ->orWhere('summary', 'LIKE', "%{$keyword}%");
            });
        }

        if (!empty($params['category']) && $params['category'] !== 'Tất cả') {
            $query->where('category', $params['category']);
        }

        $total = $query->count();

        $page = (int)($params['page'] ?? 1);
        $pageSize = (int)($params['pageSize'] ?? 20);
        $offset = ($page - 1) * $pageSize;

        $locations = $query->orderBy('sort_order', 'asc')
                          ->orderBy('id', 'desc')
                          ->skip($offset)
                          ->take($pageSize)
                          ->get();

        return [
            'data' => $locations,
            'total' => $total,
        ];
    }
}
