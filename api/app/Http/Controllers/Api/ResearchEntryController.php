<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ResearchEntryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ResearchEntryController extends Controller
{
    public function __construct(protected ResearchEntryService $researchEntryService)
    {
    }

    public function index()
    {
        try {
            $entries = $this->researchEntryService->getPublicEntries();

            return response()->json([
                'status' => 'success',
                'data' => $entries,
            ]);
        } catch (\Throwable $e) {
            Log::error('ResearchEntryController@index error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải nhật ký nghiên cứu: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->researchEntryService->getAdminEntries($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'total' => $result['total'],
            ]);
        } catch (\Throwable $e) {
            Log::error('ResearchEntryController@adminGetData error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi truy vấn dữ liệu nhật ký nghiên cứu: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            if (isset($data['sortOrder']) && !isset($data['sort_order'])) {
                $data['sort_order'] = (int) $data['sortOrder'];
            }
            if (isset($data['iconType']) && !isset($data['icon_type'])) {
                $data['icon_type'] = $data['iconType'];
            }
            if (isset($data['audioTitle']) && !isset($data['audio_title'])) {
                $data['audio_title'] = $data['audioTitle'];
            }

            $validated = validator($data, [
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
                'sort_order' => 'nullable|integer',
            ])->validate();

            $entry = $this->researchEntryService->createResearchEntry($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo ghi chép nghiên cứu thành công',
                'data' => $entry,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('ResearchEntryController@store error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tạo ghi chép nghiên cứu: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            if (isset($data['sortOrder'])) {
                $data['sort_order'] = (int) $data['sortOrder'];
            }
            if (isset($data['iconType'])) {
                $data['icon_type'] = $data['iconType'];
            }
            if (isset($data['audioTitle'])) {
                $data['audio_title'] = $data['audioTitle'];
            }

            $validated = validator($data, [
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
                'sort_order' => 'nullable|integer',
            ])->validate();

            $entry = $this->researchEntryService->updateResearchEntry($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật ghi chép nghiên cứu thành công',
                'data' => $entry,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('ResearchEntryController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật ghi chép nghiên cứu: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->researchEntryService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa ghi chép nghiên cứu thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('ResearchEntryController@destroy error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi xóa ghi chép nghiên cứu: ' . $e->getMessage(),
            ], 500);
        }
    }
}
