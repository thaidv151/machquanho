<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ArticleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ArticleController extends Controller
{
    public function __construct(protected ArticleService $articleService)
    {
    }

    public function index(Request $request)
    {
        try {
            $articles = $this->articleService->getPublicArticles($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $articles,
            ]);
        } catch (\Throwable $e) {
            Log::error('ArticleController@index error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi lấy danh sách bài viết: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($idOrSlug)
    {
        try {
            $article = $this->articleService->getArticleByIdOrSlug($idOrSlug);

            return response()->json([
                'status' => 'success',
                'data' => $article,
            ]);
        } catch (\Throwable $e) {
            Log::error('ArticleController@show error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải bài viết: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetData(Request $request)
    {
        try {
            $result = $this->articleService->getAdminArticles($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $result['data'],
                'total' => $result['total'],
            ]);
        } catch (\Throwable $e) {
            Log::error('ArticleController@adminGetData error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải danh sách quản trị bài viết: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:191',
                'category' => 'nullable|string',
                'category_name' => 'nullable|string',
                'excerpt' => 'nullable|string',
                'content' => 'nullable',
                'cover_image' => 'nullable|string',
                'coverImage' => 'nullable|string',
                'image_caption' => 'nullable|string',
                'author' => 'nullable|string',
                'author_role' => 'nullable|string',
                'read_time' => 'nullable|string',
                'featured' => 'nullable|boolean',
                'tags' => 'nullable',
                'status' => 'nullable|string',
                'audio_title' => 'nullable|string',
                'audio_duration' => 'nullable|string',
                'quote' => 'nullable',
                'gallery_images' => 'nullable',
            ]);

            $article = $this->articleService->createArticle($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo bài viết thành công',
                'data' => $article,
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('ArticleController@store error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tạo bài viết: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:191',
                'category' => 'nullable|string',
                'category_name' => 'nullable|string',
                'excerpt' => 'nullable|string',
                'content' => 'nullable',
                'cover_image' => 'nullable|string',
                'coverImage' => 'nullable|string',
                'image_caption' => 'nullable|string',
                'author' => 'nullable|string',
                'author_role' => 'nullable|string',
                'read_time' => 'nullable|string',
                'featured' => 'nullable|boolean',
                'tags' => 'nullable',
                'status' => 'nullable|string',
                'audio_title' => 'nullable|string',
                'audio_duration' => 'nullable|string',
                'quote' => 'nullable',
                'gallery_images' => 'nullable',
            ]);

            $article = $this->articleService->updateArticle($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật bài viết thành công',
                'data' => $article,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('ArticleController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật bài viết: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->articleService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa bài viết thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('ArticleController@destroy error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi xóa bài viết: ' . $e->getMessage(),
            ], 500);
        }
    }
}
