<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::query();

        if ($request->filled('category')) {
            $query->where('category_name', $request->input('category'));
        }

        if ($request->filled('searchQuery')) {
            $search = $request->input('searchQuery');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('excerpt', 'LIKE', "%{$search}%")
                  ->orWhere('author', 'LIKE', "%{$search}%");
            });
        }

        if ($request->boolean('featured')) {
            $query->where('featured', true);
        }

        $articles = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $articles,
        ]);
    }

    public function show($idOrSlug)
    {
        $article = Article::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();

        // Increment view count
        $article->increment('views');

        return response()->json([
            'status' => 'success',
            'data' => $article,
        ]);
    }

    public function adminGetData(Request $request)
    {
        $query = Article::query();

        if ($request->filled('keyword')) {
            $keyword = $request->input('keyword');
            $query->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('author', 'LIKE', "%{$keyword}%");
        }

        if ($request->filled('category')) {
            $query->where('category_name', $request->input('category'));
        }

        $articles = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $articles,
            'total' => $articles->count(),
        ]);
    }

    public function store(Request $request)
    {
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

        $slug = Str::slug($validated['title']) . '-' . time();
        $validated['slug'] = $slug;
        $validated['cover_image'] = $validated['cover_image'] ?? $validated['coverImage'] ?? null;
        $validated['category_name'] = $validated['category_name'] ?? $validated['category'] ?? 'Sự kiện';

        $article = Article::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo bài viết thành công',
            'data' => $article,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

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

        if (isset($validated['title']) && $validated['title'] !== $article->title) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . time();
        }

        if (isset($validated['coverImage'])) {
            $validated['cover_image'] = $validated['coverImage'];
        }

        if (isset($validated['category'])) {
            $validated['category_name'] = $validated['category'];
        }

        $article->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật bài viết thành công',
            'data' => $article,
        ]);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa bài viết thành công',
        ]);
    }
}
