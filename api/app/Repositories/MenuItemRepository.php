<?php

namespace App\Repositories;

use App\Models\MenuItem;

class MenuItemRepository extends BaseRepository
{
    public function __construct(MenuItem $model)
    {
        parent::__construct($model);
    }

    public function getPublicMenuItems(): array
    {
        return $this->model->newQuery()
            ->where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get()
            ->toArray();
    }

    public function getAdminMenuItems(array $params = []): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['keyword'])) {
            $keyword = $params['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('label', 'LIKE', "%{$keyword}%")
                  ->orWhere('view_type', 'LIKE', "%{$keyword}%");
            });
        }

        $total = $query->count();

        $items = $query->orderBy('sort_order', 'asc')
                      ->orderBy('id', 'asc')
                      ->get();

        return [
            'data' => $items,
            'total' => $total,
        ];
    }
}
