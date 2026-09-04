<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Models\User;

class AuthService extends BaseService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        parent::__construct($userRepository);
        $this->userRepository = $userRepository;
    }

    public function register(array $data): array
    {
        $user = $this->userRepository->createUser([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        $token = auth('api')->login($user);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function login(array $credentials): ?string
    {
        $token = auth('api')->attempt($credentials);
        return $token ?: null;
    }

    public function getAuthenticatedUser(): ?User
    {
        return auth('api')->user();
    }

    public function logout(): void
    {
        auth('api')->logout();
    }

    public function refresh(): string
    {
        return auth('api')->refresh();
    }
}
