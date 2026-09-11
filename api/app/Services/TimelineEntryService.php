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

    private function preparePayload(array $data): array
    {
        $payload = [];
        if (isset($data['title'])) $payload['title'] = $data['title'];
        if (isset($data['description'])) $payload['description'] = $data['description'];
        
        if (isset($data['tab_type'])) $payload['tab_type'] = $data['tab_type'];
        elseif (isset($data['type'])) $payload['tab_type'] = $data['type'];

        if (isset($data['time_period'])) $payload['time_period'] = $data['time_period'];
        elseif (isset($data['period'])) $payload['time_period'] = $data['period'];

        if (isset($data['image_url'])) $payload['image_url'] = $data['image_url'];
        elseif (isset($data['image'])) $payload['image_url'] = $data['image'];

        if (isset($data['icon_type'])) $payload['icon_type'] = $data['icon_type'];
        elseif (isset($data['icon'])) $payload['icon_type'] = $data['icon'];

        if (isset($data['is_active'])) $payload['is_active'] = (bool)$data['is_active'];
        elseif (isset($data['is_published'])) $payload['is_active'] = (bool)$data['is_published'];
        elseif (isset($data['isPublished'])) $payload['is_active'] = (bool)$data['isPublished'];

        if (isset($data['sort_order'])) $payload['sort_order'] = (int)$data['sort_order'];
        elseif (isset($data['sortOrder'])) $payload['sort_order'] = (int)$data['sortOrder'];

        return $payload;
    }

    public function createEntry(array $data): TimelineEntry
    {
        $payload = $this->preparePayload($data);
        $payload['tab_type'] = $payload['tab_type'] ?? 'heritage';
        $payload['time_period'] = $payload['time_period'] ?? '';
        $payload['is_active'] = $payload['is_active'] ?? true;
        $payload['sort_order'] = $payload['sort_order'] ?? 0;

        return $this->timelineRepository->create($payload);
    }

    public function updateEntry(int|string $id, array $data): TimelineEntry
    {
        $entry = $this->timelineRepository->findOrFail($id);
        $payload = $this->preparePayload($data);
        $entry->update($payload);
        return $entry->fresh();
    }

    public function deleteEntry(int|string $id): bool
    {
        return $this->timelineRepository->delete($id);
    }
}
