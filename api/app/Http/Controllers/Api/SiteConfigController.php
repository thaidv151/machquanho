<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SiteConfigService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class SiteConfigController extends Controller
{
    public function __construct(protected SiteConfigService $siteConfigService)
    {
    }

    public function index()
    {
        try {
            $data = $this->siteConfigService->getPublicConfig();

            return response()->json([
                'status' => 'success',
                'data' => $data,
            ]);
        } catch (\Throwable $e) {
            Log::error('SiteConfigController@index error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi tải cấu hình website: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'site_name' => 'nullable|string',
                'siteName' => 'nullable|string',
                'logo_type' => 'nullable|string',
                'logoType' => 'nullable|string',
                'logo_text' => 'nullable|string',
                'logoText' => 'nullable|string',
                'logo_subtext' => 'nullable|string',
                'logoSubtext' => 'nullable|string',
                'logo_image_url' => 'nullable|string',
                'logoImageUrl' => 'nullable|string',
                'banner' => 'nullable',
                'contact_email' => 'nullable|string',
                'contactEmail' => 'nullable|string',
                'contact_phone' => 'nullable|string',
                'contactPhone' => 'nullable|string',
                'address' => 'nullable|string',
                'social_links' => 'nullable',
                'socialLinks' => 'nullable',
                'header_config' => 'nullable',
                'headerConfig' => 'nullable',
                'header' => 'nullable',
                'footer' => 'nullable',
                'seo' => 'nullable',
            ]);

            $responseData = $this->siteConfigService->updateSiteConfig($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật cấu hình website thành công',
                'data' => $responseData,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('SiteConfigController@update error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi cập nhật cấu hình: ' . $e->getMessage(),
            ], 500);
        }
    }
}
