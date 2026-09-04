<?php

namespace App\Services;

use App\Repositories\ArtisanRepository;

class ArtisanService extends BaseService
{
    protected ArtisanRepository $artisanRepository;

    public function __construct(ArtisanRepository $artisanRepository)
    {
        parent::__construct($artisanRepository);
        $this->artisanRepository = $artisanRepository;
    }

    public function getPublicArtisans()
    {
        return $this->artisanRepository->getPublicArtisans();
    }

    public function getAdminArtisans(array $params): array
    {
        return $this->artisanRepository->getAdminArtisans($params);
    }
}
