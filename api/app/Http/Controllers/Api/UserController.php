<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function __construct(protected UserService $userService)
    {
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->userService->getAdminUsers($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'total' => $result['total'],
            ]);
        } catch (\Throwable $e) {
            Log::error('UserController@adminGetData error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải danh sách người dùng: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
            ]);

            $user = $this->userService->createUser($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo người dùng thành công',
                'data' => $user,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('UserController@store error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tạo người dùng: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:100',
                'email' => 'sometimes|required|email|unique:users,email,' . $id,
                'password' => 'nullable|string|min:6',
            ]);

            $user = $this->userService->updateUser($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật người dùng thành công',
                'data' => $user,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('UserController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật người dùng: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->userService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa người dùng thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('UserController@destroy error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi xóa người dùng: ' . $e->getMessage(),
            ], 500);
        }
    }
}
