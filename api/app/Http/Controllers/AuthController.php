<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(protected AuthService $authService)
    {
    }

    /**
     * Register a new User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|between:2,100',
                'email' => 'required|string|email|max:100|unique:users',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }

            $result = $this->authService->register($validator->validated());

            return response()->json([
                'message' => 'User successfully registered',
                'user' => $result['user'],
                'token' => $this->respondWithToken($result['token'])->original,
            ], 201);
        } catch (\Throwable $e) {
            Log::error('AuthController@register error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi đăng ký: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $token = $this->authService->login($validator->validated());
            if (!$token) {
                return response()->json(['error' => 'Unauthorized / Invalid credentials'], 401);
            }

            return $this->respondWithToken($token);
        } catch (\Throwable $e) {
            Log::error('AuthController@login error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi đăng nhập: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        try {
            $user = $this->authService->getAuthenticatedUser();
            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            return response()->json($user);
        } catch (\Throwable $e) {
            Log::error('AuthController@me error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            $this->authService->logout();

            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Throwable $e) {
            Log::error('AuthController@logout error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi đăng xuất: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        try {
            $newToken = $this->authService->refresh();
            return $this->respondWithToken($newToken);
        } catch (\Throwable $e) {
            Log::error('AuthController@refresh error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi làm mới token: ' . $e->getMessage(),
            ], 401);
        }
    }

    /**
     * Get the token array structure.
     *
     * @param  string  $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $this->authService->getAuthenticatedUser(),
        ]);
    }
}
