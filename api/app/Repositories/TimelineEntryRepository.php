<?php

namespace App\Repositories;

use App\Models\TimelineEntry;

class TimelineEntryRepository extends BaseRepository
{
    public function __construct(TimelineEntry $model)
    {
        parent::__construct($model);
    }

    public function getPublicEntries(?string $type = null): array
    {
        $query = $this->model->newQuery()->where('is_published', true);

        if (!empty($type)) {
            $query->where('type', $type);
        }

        return $query->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get()
            ->toArray();
    }

    public function getAdminEntries(array $params): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['type'])) {
            $query->where('type', $params['type']);
        }

        if (!empty($params['searchQuery'])) {
            $search = $params['searchQuery'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('period', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $pageIndex = max(1, (int)($params['pageIndex'] ?? 1));
        $pageSize = min(100, max(1, (int)($params['pageSize'] ?? 20)));

        $totalItems = $query->count();
        $items = $query->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->skip(($pageIndex - 1) * $pageSize)
            ->take($pageSize)
            ->get()
            ->toArray();

        return [
            'data' => $items,
            'totalItems' => $totalItems,
            'pageIndex' => $pageIndex,
            'pageSize' => $pageSize,
            'totalPages' => ceil($totalItems / $pageSize),
        ];
    }
}
