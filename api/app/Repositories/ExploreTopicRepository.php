<?php

namespace App\Repositories;

use App\Models\ExploreTopic;
use Illuminate\Support\Facades\Cache;

class ExploreTopicRepository extends BaseRepository
{
    public function __construct(ExploreTopic $model)
    {
        parent::__construct($model);
    }

    public function getPublicTopics(): array
    {
        return $this->model->newQuery()->orderBy('id', 'asc')->get()->toArray();
    }

    public function getAdminTopics(array $params): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['keyword'])) {
            $keyword = $params['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('description', 'LIKE', "%{$keyword}%");
            });
        }

        $topics = $query->orderBy('id', 'desc')->get();

        return [
            'data' => $topics,
            'total' => $topics->count(),
        ];
    }
}
