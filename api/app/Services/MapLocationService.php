<?php

namespace App\Services;

use App\Repositories\MapLocationRepository;

class MapLocationService extends BaseService
{
    protected MapLocationRepository $mapLocationRepository;

    public function __construct(MapLocationRepository $mapLocationRepository)
    {
        parent::__construct($mapLocationRepository);
        $this->mapLocationRepository = $mapLocationRepository;
    }

    public function getPublicLocations(?string $category = null): array
    {
        return $this->mapLocationRepository->getPublicLocations($category);
    }

    public function getAdminLocations(array $params): array
    {
        return $this->mapLocationRepository->getAdminLocations($params);
    }
}
