<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExploreTopicService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ExploreTopicController extends Controller
{
    public function __construct(protected ExploreTopicService $exploreTopicService)
    {
    }

    public function index()
    {
        try {
            $topics = $this->exploreTopicService->getPublicTopics();

            return response()->json([
                'status' => 'success',
                'data' => $topics,
            ]);
        } catch (\Throwable $e) {
            Log::error('ExploreTopicController@index error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải chủ đề khám phá: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->exploreTopicService->getAdminTopics($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'total' => $result['total'],
            ]);
        } catch (\Throwable $e) {
            Log::error('ExploreTopicController@adminGetData error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi truy vấn chủ đề khám phá: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:191',
                'subtitle' => 'nullable|string|max:191',
                'description' => 'nullable|string',
                'content' => 'nullable|string',
                'image' => 'nullable|string',
                'badge' => 'nullable|string|max:50',
                'details' => 'nullable',
                'highlights' => 'nullable',
            ]);

            $topic = $this->exploreTopicService->create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Thêm chủ đề khám phá thành công',
                'data' => $topic,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('ExploreTopicController@store error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi thêm chủ đề khám phá: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:191',
                'subtitle' => 'nullable|string|max:191',
                'description' => 'nullable|string',
                'content' => 'nullable|string',
                'image' => 'nullable|string',
                'badge' => 'nullable|string|max:50',
                'details' => 'nullable',
                'highlights' => 'nullable',
            ]);

            $topic = $this->exploreTopicService->update($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật chủ đề khám phá thành công',
                'data' => $topic,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('ExploreTopicController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật chủ đề khám phá: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->exploreTopicService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa chủ đề khám phá thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('ExploreTopicController@destroy error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi xóa chủ đề khám phá: ' . $e->getMessage(),
            ], 500);
        }
    }
}
