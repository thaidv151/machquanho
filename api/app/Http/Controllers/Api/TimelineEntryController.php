<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TimelineEntryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TimelineEntryController extends Controller
{
    public function __construct(protected TimelineEntryService $timelineService)
    {
    }

    public function index(Request $request)
    {
        try {
            $type = $request->query('type');
            $entries = $this->timelineService->getPublicEntries($type);

            return response()->json([
                'status' => 'success',
                'data' => $entries,
            ]);
        } catch (\Throwable $e) {
            Log::error('TimelineEntryController@index error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi lấy danh sách dòng chảy: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->timelineService->getAdminEntries($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'totalItems' => $result['totalItems'],
                'pageIndex' => $result['pageIndex'],
                'pageSize' => $result['pageSize'],
                'totalPages' => $result['totalPages'],
            ]);
        } catch (\Throwable $e) {
            Log::error('TimelineEntryController@adminGetData error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi lấy danh sách quản trị dòng chảy: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'period' => 'nullable|string|max:255',
                'time_period' => 'nullable|string|max:255',
                'description' => 'required|string',
                'image' => 'nullable|string',
                'image_url' => 'nullable|string',
                'icon' => 'nullable|string',
                'icon_type' => 'nullable|string',
                'type' => 'nullable|in:heritage,policy',
                'tab_type' => 'nullable|in:heritage,policy',
                'sort_order' => 'nullable|integer',
                'sortOrder' => 'nullable|integer',
                'is_published' => 'nullable|boolean',
                'is_active' => 'nullable|boolean',
                'isPublished' => 'nullable|boolean',
            ]);

            $entry = $this->timelineService->createEntry($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Thêm mốc lịch sử / chính sách thành công',
                'data' => $entry,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('TimelineEntryController@store error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tạo mốc timeline: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'period' => 'nullable|string|max:255',
                'time_period' => 'nullable|string|max:255',
                'description' => 'sometimes|required|string',
                'image' => 'nullable|string',
                'image_url' => 'nullable|string',
                'icon' => 'nullable|string',
                'icon_type' => 'nullable|string',
                'type' => 'nullable|in:heritage,policy',
                'tab_type' => 'nullable|in:heritage,policy',
                'sort_order' => 'nullable|integer',
                'sortOrder' => 'nullable|integer',
                'is_published' => 'nullable|boolean',
                'is_active' => 'nullable|boolean',
                'isPublished' => 'nullable|boolean',
            ]);

            $entry = $this->timelineService->updateEntry($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật mốc timeline thành công',
                'data' => $entry,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('TimelineEntryController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật mốc timeline: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->timelineService->deleteEntry($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa mốc timeline thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('TimelineEntryController@destroy error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi xóa mốc timeline: ' . $e->getMessage(),
            ], 500);
        }
    }
}
