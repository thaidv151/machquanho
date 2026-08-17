<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artisan;
use Illuminate\Http\Request;

class ArtisanController extends Controller
{
    public function index()
    {
        $artisans = Artisan::orderBy('id', 'asc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $artisans,
        ]);
    }

    public function adminGetData(Request $request)
    {
        $query = Artisan::query();

        if ($request->filled('keyword')) {
            $keyword = $request->input('keyword');
            $query->where('name', 'LIKE', "%{$keyword}%")
                  ->orWhere('village', 'LIKE', "%{$keyword}%");
        }

        $artisans = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $artisans,
            'total' => $artisans->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'honorific' => 'nullable|string|max:50',
            'birth_year' => 'nullable',
            'village' => 'nullable|string|max:100',
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string',
            'quote' => 'nullable|string',
            'specialties' => 'nullable',
            'awards' => 'nullable',
            'songs' => 'nullable',
        ]);

        $artisan = Artisan::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Thêm nghệ nhân thành công',
            'data' => $artisan,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $artisan = Artisan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'honorific' => 'nullable|string|max:50',
            'birth_year' => 'nullable',
            'village' => 'nullable|string|max:100',
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string',
            'quote' => 'nullable|string',
            'specialties' => 'nullable',
            'awards' => 'nullable',
            'songs' => 'nullable',
        ]);

        $artisan->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thông tin nghệ nhân thành công',
            'data' => $artisan,
        ]);
    }

    public function destroy($id)
    {
        $artisan = Artisan::findOrFail($id);
        $artisan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa nghệ nhân thành công',
        ]);
    }
}
