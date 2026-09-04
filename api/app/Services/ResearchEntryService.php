<?php

namespace App\Services;

use App\Repositories\ResearchEntryRepository;
use App\Models\ResearchEntry;

class ResearchEntryService extends BaseService
{
    protected ResearchEntryRepository $researchEntryRepository;

    public function __construct(ResearchEntryRepository $researchEntryRepository)
    {
        parent::__construct($researchEntryRepository);
        $this->researchEntryRepository = $researchEntryRepository;
    }

    public function getPublicEntries(): array
    {
        return $this->researchEntryRepository->getPublicEntries();
    }

    public function getAdminEntries(array $params): array
    {
        return $this->researchEntryRepository->getAdminEntries($params);
    }

    public function createResearchEntry(array $data): ResearchEntry
    {
        if (isset($data['sortOrder']) && !isset($data['sort_order'])) {
            $data['sort_order'] = (int) $data['sortOrder'];
        }
        if (isset($data['iconType']) && !isset($data['icon_type'])) {
            $data['icon_type'] = $data['iconType'];
        }
        if (isset($data['audioTitle']) && !isset($data['audio_title'])) {
            $data['audio_title'] = $data['audioTitle'];
        }

        return $this->researchEntryRepository->create($data);
    }

    public function updateResearchEntry(int|string $id, array $data): ResearchEntry
    {
        if (isset($data['sortOrder'])) {
            $data['sort_order'] = (int) $data['sortOrder'];
        }
        if (isset($data['iconType'])) {
            $data['icon_type'] = $data['iconType'];
        }
        if (isset($data['audioTitle'])) {
            $data['audio_title'] = $data['audioTitle'];
        }

        return $this->researchEntryRepository->update($id, $data);
    }
}
