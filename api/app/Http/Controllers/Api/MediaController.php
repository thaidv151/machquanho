<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MediaCategoryService;
use App\Services\MediaPostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MediaController extends Controller
{
    public function __construct(
        protected MediaCategoryService $mediaCategoryService,
        protected MediaPostService $mediaPostService
    ) {
    }

    public function getCategories()
    {
        try {
            $categories = $this->mediaCategoryService->getActiveCategories();

            return response()->json([
                'status' => 'success',
                'data' => $categories,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@getCategories error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải danh mục media: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getPosts(Request $request)
    {
        try {
            $params = $request->all();
            $posts = $this->mediaPostService->getFilteredPosts($params);

            return response()->json([
                'status' => 'success',
                'data' => $posts,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@getPosts error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải danh sách bài media: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getFeaturedToday()
    {
        try {
            $featured = $this->mediaPostService->getFeaturedToday();

            return response()->json([
                'status' => 'success',
                'data' => $featured,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@getFeaturedToday error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải bài nổi bật hôm nay: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show($slug)
    {
        try {
            $post = $this->mediaPostService->getBySlug($slug);

            if (!$post) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy bài media',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $post,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@show error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải chi tiết bài media: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function incrementPlay($id)
    {
        try {
            $this->mediaPostService->incrementPlayCount($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Đã tăng lượt nghe thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@incrementPlay error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tăng lượt nghe: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Admin CRUD endpoints
    public function adminGetCategories(Request $request)
    {
        try {
            $categories = $this->mediaCategoryService->getAll();

            return response()->json([
                'status' => 'success',
                'data' => $categories,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@adminGetCategories error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải danh mục media admin: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function adminGetPosts(Request $request)
    {
        try {
            $posts = $this->mediaPostService->getFilteredPosts($request->all());

            return response()->json([
                'status' => 'success',
                'data' => $posts,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@adminGetPosts error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải danh sách media admin: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function storePost(Request $request)
    {
        try {
            $data = $request->validate([
                'category_id' => 'required|integer',
                'title' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255',
                'sub_title' => 'nullable|string',
                'description' => 'nullable|string',
                'content' => 'nullable|string',
                'media_type' => 'required|string',
                'media_url' => 'nullable|string',
                'thumbnail_url' => 'nullable|string',
                'duration' => 'nullable|string',
                'is_featured' => 'nullable|boolean',
                'status' => 'nullable|string',
            ]);

            if (empty($data['slug'])) {
                $data['slug'] = \Illuminate\Support\Str::slug($data['title']) . '-' . time();
            }

            $post = $this->mediaPostService->create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo bài media mới thành công',
                'data' => $post,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@storePost error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo bài media: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updatePost(Request $request, $id)
    {
        try {
            $data = $request->all();
            if (isset($data['title']) && empty($data['slug'])) {
                $data['slug'] = \Illuminate\Support\Str::slug($data['title']);
            }

            $post = $this->mediaPostService->update($id, $data);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật bài media thành công',
                'data' => $post,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@updatePost error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi cập nhật bài media: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deletePost($id)
    {
        try {
            $this->mediaPostService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa bài media thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@deletePost error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi xóa bài media: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function storeCategory(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'order_index' => 'nullable|integer',
                'is_active' => 'nullable|boolean',
            ]);

            if (empty($data['slug'])) {
                $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
            }

            $category = $this->mediaCategoryService->create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo danh mục media thành công',
                'data' => $category,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@storeCategory error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo danh mục media: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateCategory(Request $request, $id)
    {
        try {
            $data = $request->all();
            $category = $this->mediaCategoryService->update($id, $data);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật danh mục media thành công',
                'data' => $category,
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@updateCategory error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi cập nhật danh mục media: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteCategory($id)
    {
        try {
            $this->mediaCategoryService->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa danh mục media thành công',
            ]);
        } catch (\Throwable $e) {
            Log::error('MediaController@deleteCategory error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi xóa danh mục media: ' . $e->getMessage(),
            ], 500);
        }
    }
}
