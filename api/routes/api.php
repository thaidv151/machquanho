<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected Auth Routes (Require JWT Token)
    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// Protected Business API Routes (Require JWT Token)
Route::middleware('auth:api')->group(function () {
    Route::get('/status', function () {
        return response()->json([
            'status' => 'success',
            'message' => 'Laravel API backend is running with JWT Authentication!',
            'user' => auth('api')->user(),
            'database' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName(),
            'timestamp' => now()->toIso8601String(),
        ]);
    });
});
