<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Models\User;

class UserService extends BaseService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        parent::__construct($userRepository);
        $this->userRepository = $userRepository;
    }

    public function getAdminUsers(array $params): array
    {
        return $this->userRepository->getAdminUsers($params);
    }

    public function createUser(array $data): User
    {
        return $this->userRepository->createUser($data);
    }

    public function updateUser(int|string $id, array $data): User
    {
        return $this->userRepository->updateUser($id, $data);
    }
}
