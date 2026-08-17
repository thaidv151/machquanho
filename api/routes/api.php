<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/status', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel API backend is running!',
        'database' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName(),
        'timestamp' => now()->toIso8601String(),
    ]);
});
