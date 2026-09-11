<?php

namespace App\Services;

use App\Repositories\SiteConfigRepository;

class SiteConfigService extends BaseService
{
    protected SiteConfigRepository $siteConfigRepository;

    public function __construct(SiteConfigRepository $siteConfigRepository)
    {
        parent::__construct($siteConfigRepository);
        $this->siteConfigRepository = $siteConfigRepository;
    }

    public function getPublicConfig(): array
    {
        return $this->siteConfigRepository->getPublicConfig();
    }

    public function updateSiteConfig(array $validatedData): array
    {
        return $this->siteConfigRepository->updateSiteConfig($validatedData);
    }

    public function getMapConfig(): array
    {
        return $this->siteConfigRepository->getMapConfig();
    }

    public function updateMapConfig(array $validatedData): array
    {
        return $this->siteConfigRepository->updateMapConfig($validatedData);
    }
}
