<?php

namespace App\Repositories;

use App\Models\TimelineEntry;

class TimelineEntryRepository extends BaseRepository
{
    public function __construct(TimelineEntry $model)
    {
        parent::__construct($model);
    }

    private function mapEntry(array $entry): array
    {
        return array_merge($entry, [
            'period' => $entry['time_period'] ?? $entry['period'] ?? '',
            'type' => $entry['tab_type'] ?? $entry['type'] ?? 'heritage',
            'image' => $entry['image_url'] ?? $entry['image'] ?? '',
            'icon' => $entry['icon_type'] ?? $entry['icon'] ?? '',
            'isPublished' => (bool)($entry['is_active'] ?? $entry['is_published'] ?? true),
            'is_published' => (bool)($entry['is_active'] ?? $entry['is_published'] ?? true),
        ]);
    }

    public function getPublicEntries(?string $type = null): array
    {
        $query = $this->model->newQuery()->where('is_active', true);

        if (!empty($type)) {
            $query->where('tab_type', $type);
        }

        $items = $query->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get()
            ->toArray();

        return array_map([$this, 'mapEntry'], $items);
    }

    public function getAdminEntries(array $params): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['type']) && $params['type'] !== 'all') {
            $query->where('tab_type', $params['type']);
        }

        if (!empty($params['searchQuery'])) {
            $search = $params['searchQuery'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('time_period', 'LIKE', "%{$search}%")
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
            'data' => array_map([$this, 'mapEntry'], $items),
            'totalItems' => $totalItems,
            'pageIndex' => $pageIndex,
            'pageSize' => $pageSize,
            'totalPages' => ceil($totalItems / $pageSize),
        ];
    }
}
