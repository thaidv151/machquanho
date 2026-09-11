<?php

namespace App\Services;

use App\Repositories\MediaCategoryRepository;

class MediaCategoryService extends BaseService
{
    protected MediaCategoryRepository $mediaCategoryRepository;

    public function __construct(MediaCategoryRepository $mediaCategoryRepository)
    {
        parent::__construct($mediaCategoryRepository);
        $this->mediaCategoryRepository = $mediaCategoryRepository;
    }

    public function getActiveCategories()
    {
        return $this->mediaCategoryRepository->getActiveCategories();
    }
}
