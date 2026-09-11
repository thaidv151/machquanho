<?php

namespace App\Repositories;

use App\Models\MediaCategory;

class MediaCategoryRepository extends BaseRepository
{
    public function __construct(MediaCategory $model)
    {
        parent::__construct($model);
    }

    public function getActiveCategories()
    {
        return $this->model->newQuery()
            ->where('is_active', true)
            ->orderBy('order_index', 'asc')
            ->orderBy('id', 'asc')
            ->get();
    }
}
