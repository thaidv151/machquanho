<?php

namespace App\Services;

use App\Repositories\ExploreTopicRepository;

class ExploreTopicService extends BaseService
{
    protected ExploreTopicRepository $exploreTopicRepository;

    public function __construct(ExploreTopicRepository $exploreTopicRepository)
    {
        parent::__construct($exploreTopicRepository);
        $this->exploreTopicRepository = $exploreTopicRepository;
    }

    public function getPublicTopics(): array
    {
        return $this->exploreTopicRepository->getPublicTopics();
    }

    public function getAdminTopics(array $params): array
    {
        return $this->exploreTopicRepository->getAdminTopics($params);
    }
}
