<?php

namespace App\Services;

use App\Repositories\TeamMemberRepository;
use App\Models\TeamMember;

class TeamMemberService extends BaseService
{
    protected TeamMemberRepository $teamMemberRepository;

    public function __construct(TeamMemberRepository $teamMemberRepository)
    {
        parent::__construct($teamMemberRepository);
        $this->teamMemberRepository = $teamMemberRepository;
    }

    public function getPublicMembers(): array
    {
        return $this->teamMemberRepository->getPublicMembers();
    }

    public function getAdminMembers(array $params): array
    {
        return $this->teamMemberRepository->getAdminMembers($params);
    }

    public function createMember(array $data): TeamMember
    {
        if (!isset($data['role']) || empty($data['role'])) {
            $data['role'] = 'Thành viên';
        }
        return $this->teamMemberRepository->create($data);
    }
}
