<?php

namespace App\Services;

use App\Repositories\TimelineEntryRepository;
use App\Models\TimelineEntry;

class TimelineEntryService extends BaseService
{
    protected TimelineEntryRepository $timelineRepository;

    public function __construct(TimelineEntryRepository $timelineRepository)
    {
        parent::__construct($timelineRepository);
        $this->timelineRepository = $timelineRepository;
    }

    public function getPublicEntries(?string $type = null): array
    {
        return $this->timelineRepository->getPublicEntries($type);
    }

    public function getAdminEntries(array $params): array
    {
        return $this->timelineRepository->getAdminEntries($params);
    }

    public function createEntry(array $data): TimelineEntry
    {
        $data['type'] = $data['type'] ?? 'heritage';
        $data['is_published'] = isset($data['is_published']) ? (bool)$data['is_published'] : true;
        $data['sort_order'] = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;

        return $this->timelineRepository->create($data);
    }

    public function updateEntry(int|string $id, array $data): TimelineEntry
    {
        $entry = $this->timelineRepository->findOrFail($id);
        
        if (isset($data['is_published'])) {
            $data['is_published'] = (bool)$data['is_published'];
        }
        if (isset($data['sort_order'])) {
            $data['sort_order'] = (int)$data['sort_order'];
        }

        $entry->update($data);
        return $entry->fresh();
    }

    public function deleteEntry(int|string $id): bool
    {
        return $this->timelineRepository->delete($id);
    }
}
