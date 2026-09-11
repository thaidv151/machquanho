<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MapLocationService;
use App\Services\SiteConfigService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class MapLocationController extends Controller
{
    public function __construct(
        protected MapLocationService $mapLocationService,
        protected SiteConfigService $siteConfigService
    ) {
    }

    public function index(Request $request)
    {
        try {
            $category = $request->query('category');
            $locations = $this->mapLocationService->getPublicLocations($category);

            return response()->json([
                'status' => 'success',
                'data' => $locations,
            ]);
        } catch (\Throwable $e) {
            Log::error('MapLocationController@index error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi lấy danh sách điểm bản đồ: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $location = $this->mapLocationService->find($id);
            if (!$location) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy điểm bản đồ',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $location,
            ]);
        } catch (\Throwable $e) {
            Log::error('MapLocationController@show error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải chi tiết điểm bản đồ: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->mapLocationService->getAdminLocations($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'total' => $result['total'],
            ]);
        } catch (\Throwable $e) {
            Log::error('MapLocationController@adminGetData error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi truy vấn danh sách điểm bản đồ admin: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:191',
                'category' => 'required|string|max:100',
                'address' => 'nullable|string|max:255',
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'image_url' => 'nullable|string',
                'summary' => 'nullable|string',
                'content' => 'nullable|string',
                'status' => 'boolean',
                'sort_order' => 'integer',
            ]);

            $location = $this->mapLocationService->create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Thêm điểm bản đồ di sản thành công',
                'data' => $location,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('MapLocationController@store error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi thêm điểm bản đồ: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:191',
                'category' => 'sometimes|required|string|max:100',
                'address' => 'nullable|string|max:255',
                'latitude' => 'sometimes|required|numeric',
                'longitude' => 'sometimes|required|numeric',
                'image_url' => 'nullable|string',
                'summary' => 'nullable|string',
                'content' => 'nullable|string',
                'status' => 'boolean',
                'sort_order' => 'integer',
            ]);

            $location = $this->mapLocationService->update($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật điểm bản đồ di sản thành công',
                'data' => $location,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('MapLocationController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật điểm bản đồ: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->mapLocationService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa điểm bản đồ di sản thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('MapLocationController@destroy error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi xóa điểm bản đồ: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getMapConfig()
    {
        try {
            $data = $this->siteConfigService->getMapConfig();

            return response()->json([
                'status' => 'success',
                'data' => $data,
            ]);
        } catch (\Throwable $e) {
            Log::error('MapLocationController@getMapConfig error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải cấu hình bản đồ: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateMapConfig(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:191',
                'subtitle' => 'nullable|string|max:255',
                'height' => 'required|string|max:50',
                'width' => 'required|string|max:50',
                'defaultLat' => 'required|numeric',
                'defaultLng' => 'required|numeric',
                'defaultZoom' => 'required|integer|min:1|max:20',
                'categories' => 'nullable|array',
                'categories.*.id' => 'nullable|string',
                'categories.*.name' => 'required|string|max:100',
                'categories.*.icon' => 'nullable|string',
                'categories.*.color' => 'nullable|string',
                'categories.*.sort_order' => 'nullable|integer',
            ]);

            $savedConfig = $this->siteConfigService->updateMapConfig($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật cấu hình tổng quan bản đồ thành công',
                'data' => $savedConfig,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('MapLocationController@updateMapConfig error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi cập nhật cấu hình bản đồ: ' . $e->getMessage(),
            ], 500);
        }
    }
}
