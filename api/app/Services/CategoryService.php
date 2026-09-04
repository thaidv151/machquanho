<?php

namespace App\Services;

use App\Repositories\CategoryRepository;

class CategoryService extends BaseService
{
    protected CategoryRepository $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        parent::__construct($categoryRepository);
        $this->categoryRepository = $categoryRepository;
    }

    public function getPublicCategories(): array
    {
        return $this->categoryRepository->getPublicCategories();
    }

    public function getAdminCategories(array $params): array
    {
        return $this->categoryRepository->getAdminCategories($params);
    }
}
