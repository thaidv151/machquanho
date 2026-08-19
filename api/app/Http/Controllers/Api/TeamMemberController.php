<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index()
    {
        $members = TeamMember::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $members,
        ]);
    }

    public function adminGetData(Request $request)
    {
        $query = TeamMember::query();

        if ($request->filled('keyword')) {
            $keyword = $request->input('keyword');
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'LIKE', "%{$keyword}%")
                  ->orWhere('role', 'LIKE', "%{$keyword}%")
                  ->orWhere('bio', 'LIKE', "%{$keyword}%");
            });
        }

        $members = $query->orderBy('sort_order', 'asc')->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $members,
            'total' => $members->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'role' => 'nullable|string|max:100',
            'avatar' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if (!isset($validated['role']) || empty($validated['role'])) {
            $validated['role'] = 'Thành viên';
        }

        $member = TeamMember::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm thành viên nhóm nghiên cứu thành công',
            'data' => $member,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'role' => 'nullable|string|max:100',
            'avatar' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $member->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thông tin thành viên thành công',
            'data' => $member,
        ]);
    }

    public function destroy($id)
    {
        $member = TeamMember::findOrFail($id);
        $member->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa thành viên thành công',
        ]);
    }
}
