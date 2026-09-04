<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TeamMemberService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class TeamMemberController extends Controller
{
    public function __construct(protected TeamMemberService $teamMemberService)
    {
    }

    public function index()
    {
        try {
            $members = $this->teamMemberService->getPublicMembers();

            return response()->json([
                'status' => 'success',
                'data' => $members,
            ]);
        } catch (\Throwable $e) {
            Log::error('TeamMemberController@index error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải thành viên: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->teamMemberService->getAdminMembers($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'total' => $result['total'],
            ]);
        } catch (\Throwable $e) {
            Log::error('TeamMemberController@adminGetData error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi truy vấn dữ liệu thành viên: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'role' => 'nullable|string|max:100',
                'avatar' => 'nullable|string|max:255',
                'bio' => 'nullable|string',
                'sort_order' => 'nullable|integer',
                'is_active' => 'nullable|boolean',
            ]);

            $member = $this->teamMemberService->createMember($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Thêm thành viên nhóm nghiên cứu thành công',
                'data' => $member,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('TeamMemberController@store error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi thêm thành viên: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:100',
                'role' => 'nullable|string|max:100',
                'avatar' => 'nullable|string|max:255',
                'bio' => 'nullable|string',
                'sort_order' => 'nullable|integer',
                'is_active' => 'nullable|boolean',
            ]);

            $member = $this->teamMemberService->update($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thông tin thành viên thành công',
                'data' => $member,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('TeamMemberController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật thành viên: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->teamMemberService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa thành viên thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('TeamMemberController@destroy error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi xóa thành viên: ' . $e->getMessage(),
            ], 500);
        }
    }
}
