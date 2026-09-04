<?php

namespace App\Repositories;

use App\Models\Artisan;

class ArtisanRepository extends BaseRepository
{
    public function __construct(Artisan $model)
    {
        parent::__construct($model);
    }

    public function getPublicArtisans()
    {
        return $this->model->newQuery()->orderBy('id', 'asc')->get();
    }

    public function getAdminArtisans(array $params): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['keyword'])) {
            $keyword = $params['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'LIKE', "%{$keyword}%")
                  ->orWhere('village', 'LIKE', "%{$keyword}%");
            });
        }

        $artisans = $query->orderBy('id', 'desc')->get();

        return [
            'data' => $artisans,
            'total' => $artisans->count(),
        ];
    }
}
