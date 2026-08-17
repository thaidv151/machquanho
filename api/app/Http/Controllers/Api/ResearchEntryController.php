<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResearchEntry;
use Illuminate\Http\Request;

class ResearchEntryController extends Controller
{
    public function index()
    {
        $entries = ResearchEntry::orderBy('id', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $entries,
        ]);
    }

    public function adminGetData(Request $request)
    {
        $query = ResearchEntry::query();

        if ($request->filled('keyword')) {
            $keyword = $request->input('keyword');
            $query->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('summary', 'LIKE', "%{$keyword}%");
        }

        $entries = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $entries,
            'total' => $entries->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:191',
            'date' => 'nullable|string',
            'location' => 'nullable|string',
            'phase' => 'nullable|string',
            'icon_type' => 'nullable|string',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'findings' => 'nullable',
            'images' => 'nullable',
            'audio_title' => 'nullable|string',
            'researcher' => 'nullable|string',
        ]);

        $entry = ResearchEntry::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo ghi chép nghiên cứu thành công',
            'data' => $entry,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $entry = ResearchEntry::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:191',
            'date' => 'nullable|string',
            'location' => 'nullable|string',
            'phase' => 'nullable|string',
            'icon_type' => 'nullable|string',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'findings' => 'nullable',
            'images' => 'nullable',
            'audio_title' => 'nullable|string',
            'researcher' => 'nullable|string',
        ]);

        $entry->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật ghi chép nghiên cứu thành công',
            'data' => $entry,
        ]);
    }

    public function destroy($id)
    {
        $entry = ResearchEntry::findOrFail($id);
        $entry->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa ghi chép nghiên cứu thành công',
        ]);
    }
}
