<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $categoryService)
    {
    }

    public function index()
    {
        try {
            $categories = $this->categoryService->getPublicCategories();

            return response()->json([
                'status' => 'success',
                'data' => $categories,
            ]);
        } catch (\Throwable $e) {
            Log::error('CategoryController@index error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải danh mục: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->categoryService->getAdminCategories($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'total' => $result['total'],
            ]);
        } catch (\Throwable $e) {
            Log::error('CategoryController@adminGetData error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi truy vấn dữ liệu danh mục: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'slug' => 'required|string|max:120|unique:categories,slug',
                'color' => 'nullable|string|max:50',
                'description' => 'nullable|string',
            ]);

            $category = $this->categoryService->create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo danh mục thành công',
                'data' => $category,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('CategoryController@store error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tạo danh mục: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:100',
                'slug' => 'sometimes|required|string|max:120|unique:categories,slug,' . $id,
                'color' => 'nullable|string|max:50',
                'description' => 'nullable|string',
            ]);

            $category = $this->categoryService->update($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật danh mục thành công',
                'data' => $category,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('CategoryController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật danh mục: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->categoryService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa danh mục thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('CategoryController@destroy error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi xóa danh mục: ' . $e->getMessage(),
            ], 500);
        }
    }
}
