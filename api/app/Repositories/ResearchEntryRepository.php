<?php

namespace App\Repositories;

use App\Models\ResearchEntry;

class ResearchEntryRepository extends BaseRepository
{
    public function __construct(ResearchEntry $model)
    {
        parent::__construct($model);
    }

    public function getPublicEntries(): array
    {
        return $this->model->newQuery()
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->get()
            ->toArray();
    }

    public function getAdminEntries(array $params): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['keyword'])) {
            $keyword = $params['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('summary', 'LIKE', "%{$keyword}%");
            });
        }

        $entries = $query->orderBy('sort_order', 'asc')->orderBy('id', 'desc')->get();

        return [
            'data' => $entries,
            'total' => $entries->count(),
        ];
    }
}
