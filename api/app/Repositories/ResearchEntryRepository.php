<?php

namespace App\Repositories;

use App\Models\ResearchEntry;
use Illuminate\Support\Facades\Cache;

class ResearchEntryRepository extends BaseRepository
{
    public function __construct(ResearchEntry $model)
    {
        parent::__construct($model);
    }

    public function getPublicEntries(): array
    {
        return Cache::remember('public_research_entries', 300, function () {
            return $this->model->newQuery()
                ->orderBy('sort_order', 'asc')
                ->orderBy('id', 'desc')
                ->get()
                ->toArray();
        });
    }

    public function create(array $data)
    {
        Cache::forget('public_research_entries');
        return parent::create($data);
    }

    public function update($id, array $data)
    {
        Cache::forget('public_research_entries');
        return parent::update($id, $data);
    }

    public function delete($id)
    {
        Cache::forget('public_research_entries');
        return parent::delete($id);
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
