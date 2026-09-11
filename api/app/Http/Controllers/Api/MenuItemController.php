<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MenuItemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MenuItemController extends Controller
{
    public function __construct(
        protected MenuItemService $menuItemService
    ) {
    }

    public function index()
    {
        try {
            $items = $this->menuItemService->getPublicMenuItems();

            return response()->json([
                'status' => 'success',
                'data' => $items,
            ]);
        } catch (\Throwable $e) {
            Log::error('MenuItemController@index error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải danh sách menu: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->menuItemService->getAdminMenuItems($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'total' => $result['total'],
            ]);
        } catch (\Throwable $e) {
            Log::error('MenuItemController@adminGetData error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải danh sách menu admin: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'label' => 'required|string|max:191',
                'view_type' => 'required|string|max:191',
                'icon' => 'nullable|string|max:100',
                'custom_icon_url' => 'nullable|string',
                'sort_order' => 'integer',
                'is_active' => 'boolean',
            ]);

            if (!isset($validated['sort_order'])) {
                $validated['sort_order'] = count($this->menuItemService->getPublicMenuItems()) + 1;
            }

            $item = $this->menuItemService->create($validated);

            return response()->json([
                'status' => 'success',
                'data' => $item,
                'message' => 'Tạo mục menu mới thành công',
            ], 201);
        } catch (\Throwable $e) {
            Log::error('MenuItemController@store error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo mục menu mới: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'label' => 'sometimes|required|string|max:191',
                'view_type' => 'sometimes|required|string|max:191',
                'icon' => 'nullable|string|max:100',
                'custom_icon_url' => 'nullable|string',
                'sort_order' => 'integer',
                'is_active' => 'boolean',
            ]);

            $item = $this->menuItemService->update($id, $validated);

            return response()->json([
                'status' => 'success',
                'data' => $item,
                'message' => 'Cập nhật mục menu thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('MenuItemController@update error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi cập nhật mục menu: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->menuItemService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa mục menu thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('MenuItemController@destroy error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi xóa mục menu: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function reorder(Request $request)
    {
        try {
            $validated = $request->validate([
                'ordered_ids' => 'required|array',
            ]);

            $this->menuItemService->reorder($validated['ordered_ids']);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thứ tự menu thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('MenuItemController@reorder error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi cập nhật thứ tự menu: ' . $e->getMessage(),
            ], 500);
        }
    }
}
