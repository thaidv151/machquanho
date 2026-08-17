<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,jpg,png,gif,svg,webp|max:10240',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            
            // Ensure public/uploads directory exists
            $destinationPath = public_path('uploads');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $filename);

            $url = asset('uploads/' . $filename);

            return response()->json([
                'status' => 'success',
                'message' => 'Upload ảnh thành công!',
                'url' => $url,
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Không tìm thấy file tải lên',
        ], 400);
    }
}
