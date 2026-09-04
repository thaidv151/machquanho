<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ArtisanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ArtisanController extends Controller
{
    public function __construct(protected ArtisanService $artisanService)
    {
    }

    public function index()
    {
        try {
            $artisans = $this->artisanService->getPublicArtisans();
            return response()->json([
                'status' => 'success',
                'data' => $artisans,
            ]);
        } catch (\Throwable $e) {
            Log::error('ArtisanController@index error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải danh sách nghệ nhân: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->artisanService->getAdminArtisans($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'total' => $result['total'],
            ]);
        } catch (\Throwable $e) {
            Log::error('ArtisanController@adminGetData error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi truy vấn dữ liệu nghệ nhân: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
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

            $artisan = $this->artisanService->create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Thêm nghệ nhân thành công',
                'data' => $artisan,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('ArtisanController@store error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi thêm nghệ nhân: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
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

            $artisan = $this->artisanService->update($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thông tin nghệ nhân thành công',
                'data' => $artisan,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('ArtisanController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật nghệ nhân: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->artisanService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa nghệ nhân thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('ArtisanController@destroy error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi xóa nghệ nhân: ' . $e->getMessage(),
            ], 500);
        }
    }
}
