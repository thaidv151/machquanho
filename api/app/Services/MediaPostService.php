<?php

namespace App\Services;

use App\Repositories\MediaPostRepository;

class MediaPostService extends BaseService
{
    protected MediaPostRepository $mediaPostRepository;

    public function __construct(MediaPostRepository $mediaPostRepository)
    {
        parent::__construct($mediaPostRepository);
        $this->mediaPostRepository = $mediaPostRepository;
    }

    public function getFilteredPosts(array $params)
    {
        return $this->mediaPostRepository->getFilteredPosts($params);
    }

    public function getFeaturedToday()
    {
        return $this->mediaPostRepository->getFeaturedToday();
    }

    public function getBySlug(string $slug)
    {
        $post = $this->mediaPostRepository->findBySlug($slug);
        if ($post) {
            $this->mediaPostRepository->incrementPlayCount($post->id);
        }
        return $post;
    }

    public function incrementPlayCount($id)
    {
        return $this->mediaPostRepository->incrementPlayCount($id);
    }
}
