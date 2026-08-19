<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ArtisanController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExploreTopicController;
use App\Http\Controllers\Api\ResearchEntryController;
use App\Http\Controllers\Api\SiteConfigController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Client Endpoints
|--------------------------------------------------------------------------
*/
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{idOrSlug}', [ArticleController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/research-entries', [ResearchEntryController::class, 'index']);
Route::get('/artisans', [ArtisanController::class, 'index']);
Route::get('/explore-topics', [ExploreTopicController::class, 'index']);
Route::get('/team-members', [TeamMemberController::class, 'index']);
Route::get('/site-config', [SiteConfigController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Auth Endpoints
|--------------------------------------------------------------------------
*/
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

/*
|--------------------------------------------------------------------------
| Protected Admin Endpoints (Requires JWT Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->prefix('admin')->group(function () {
    Route::get('/status', function () {
        return response()->json([
            'status' => 'success',
            'message' => 'Laravel API backend is running with JWT Authentication!',
            'user' => auth('api')->user(),
            'database' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName(),
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    // Categories Management
    Route::post('/categories/GetData', [CategoryController::class, 'adminGetData']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::post('/categories/{id}/update', [CategoryController::class, 'update']);
    Route::post('/categories/{id}/delete', [CategoryController::class, 'destroy']);

    // Articles Management
    Route::post('/articles/GetData', [ArticleController::class, 'adminGetData']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::post('/articles/{id}/update', [ArticleController::class, 'update']);
    Route::post('/articles/{id}/delete', [ArticleController::class, 'destroy']);

    // Research Entries Management
    Route::post('/research-entries/GetData', [ResearchEntryController::class, 'adminGetData']);
    Route::post('/research-entries', [ResearchEntryController::class, 'store']);
    Route::post('/research-entries/{id}/update', [ResearchEntryController::class, 'update']);
    Route::post('/research-entries/{id}/delete', [ResearchEntryController::class, 'destroy']);

    // Artisans Management
    Route::post('/artisans/GetData', [ArtisanController::class, 'adminGetData']);
    Route::post('/artisans', [ArtisanController::class, 'store']);
    Route::post('/artisans/{id}/update', [ArtisanController::class, 'update']);
    Route::post('/artisans/{id}/delete', [ArtisanController::class, 'destroy']);

    // Explore Topics Management
    Route::post('/explore-topics/GetData', [ExploreTopicController::class, 'adminGetData']);
    Route::post('/explore-topics', [ExploreTopicController::class, 'store']);
    Route::post('/explore-topics/{id}/update', [ExploreTopicController::class, 'update']);
    Route::post('/explore-topics/{id}/delete', [ExploreTopicController::class, 'destroy']);

    // Team Members Management
    Route::post('/team-members/GetData', [TeamMemberController::class, 'adminGetData']);
    Route::post('/team-members', [TeamMemberController::class, 'store']);
    Route::post('/team-members/{id}/update', [TeamMemberController::class, 'update']);
    Route::post('/team-members/{id}/delete', [TeamMemberController::class, 'destroy']);

    // Site Config Management
    Route::post('/site-config', [SiteConfigController::class, 'update']);

    // Users Management
    Route::post('/users/GetData', [UserController::class, 'adminGetData']);
    Route::post('/users', [UserController::class, 'store']);
    Route::post('/users/{id}/update', [UserController::class, 'update']);
    Route::post('/users/{id}/delete', [UserController::class, 'destroy']);

    // File Upload API
    Route::post('/upload', [\App\Http\Controllers\Api\UploadController::class, 'upload']);
});
