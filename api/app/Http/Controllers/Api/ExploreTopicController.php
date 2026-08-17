<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExploreTopic;
use Illuminate\Http\Request;

class ExploreTopicController extends Controller
{
    public function index()
    {
        $topics = ExploreTopic::orderBy('id', 'asc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $topics,
        ]);
    }

    public function adminGetData(Request $request)
    {
        $query = ExploreTopic::query();

        if ($request->filled('keyword')) {
            $keyword = $request->input('keyword');
            $query->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('description', 'LIKE', "%{$keyword}%");
        }

        $topics = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $topics,
            'total' => $topics->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:191',
            'subtitle' => 'nullable|string|max:191',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'badge' => 'nullable|string|max:50',
            'details' => 'nullable',
            'highlights' => 'nullable',
        ]);

        $topic = ExploreTopic::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm chủ đề khám phá thành công',
            'data' => $topic,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $topic = ExploreTopic::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:191',
            'subtitle' => 'nullable|string|max:191',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'badge' => 'nullable|string|max:50',
            'details' => 'nullable',
            'highlights' => 'nullable',
        ]);

        $topic->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật chủ đề khám phá thành công',
            'data' => $topic,
        ]);
    }

    public function destroy($id)
    {
        $topic = ExploreTopic::findOrFail($id);
        $topic->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa chủ đề khám phá thành công',
        ]);
    }
}
