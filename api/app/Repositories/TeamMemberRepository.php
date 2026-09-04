<?php

namespace App\Repositories;

use App\Models\TeamMember;
use Illuminate\Support\Facades\Cache;

class TeamMemberRepository extends BaseRepository
{
    public function __construct(TeamMember $model)
    {
        parent::__construct($model);
    }

    public function getPublicMembers(): array
    {
        return $this->model->newQuery()
            ->where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get()
            ->toArray();
    }

    public function getAdminMembers(array $params): array
    {
        $query = $this->model->newQuery();

        if (!empty($params['keyword'])) {
            $keyword = $params['keyword'];
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'LIKE', "%{$keyword}%")
                  ->orWhere('role', 'LIKE', "%{$keyword}%")
                  ->orWhere('bio', 'LIKE', "%{$keyword}%");
            });
        }

        $members = $query->orderBy('sort_order', 'asc')->orderBy('id', 'desc')->get();

        return [
            'data' => $members,
            'total' => $members->count(),
        ];
    }
}
