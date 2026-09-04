<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:jpeg,jpg,png,gif,svg,webp,mp4,webm,ogg,mov,mkv,avi,flv,wmv,mp3,wav|max:102400',
            ]);

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
                $filename = time() . '_' . Str::random(8) . '.' . $extension;
                
                // Ensure public/uploads directory exists
                $destinationPath = public_path('uploads');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $file->move($destinationPath, $filename);

                $url = asset('uploads/' . $filename);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Upload file thành công!',
                    'url' => $url,
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy file tải lên',
            ], 400);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('UploadController@upload error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải file: ' . $e->getMessage(),
            ], 500);
        }
    }
}
