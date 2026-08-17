<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class SiteConfigController extends Controller
{
    public function index()
    {
        $config = SiteConfig::first() ?? new SiteConfig([
            'site_name' => 'Mạch Quan Họ',
            'logo_type' => 'text',
            'logo_text' => 'Mạch Quan Họ',
            'logo_subtext' => 'Di sản Văn hóa Kinh Bắc',
        ]);

        $data = $config->toArray();

        // Fallback: if header_config column doesn't exist on DB, retrieve from banner JSON
        if (!Schema::hasColumn('site_configs', 'header_config')) {
            $bannerData = is_array($config->banner) ? $config->banner : (json_decode($config->banner, true) ?? []);
            if (isset($bannerData['header_config'])) {
                $data['header_config'] = $bannerData['header_config'];
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    public function update(Request $request)
    {
        $config = SiteConfig::firstOrCreate(['id' => 1]);

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

        $headerConfig = $validated['header_config'] ?? $validated['headerConfig'] ?? $validated['header'] ?? null;
        $footerConfig = $validated['footer'] ?? null;
        $seoConfig = $validated['seo'] ?? null;
        $bannerInput = $validated['banner'] ?? $config->banner;
        $bannerData = is_array($bannerInput) ? $bannerInput : (json_decode($bannerInput, true) ?? []);

        $hasHeaderColumn = Schema::hasColumn('site_configs', 'header_config');

        if (!$hasHeaderColumn && $headerConfig !== null) {
            // Save inside banner JSON as fallback if column doesn't exist on host database
            $bannerData['header_config'] = $headerConfig;
        }

        $payload = [
            'site_name' => $validated['site_name'] ?? $validated['siteName'] ?? $config->site_name,
            'logo_type' => $validated['logo_type'] ?? $validated['logoType'] ?? $config->logo_type,
            'logo_text' => $validated['logo_text'] ?? $validated['logoText'] ?? $config->logo_text,
            'logo_subtext' => $validated['logo_subtext'] ?? $validated['logoSubtext'] ?? $config->logo_subtext,
            'logo_image_url' => $validated['logo_image_url'] ?? $validated['logoImageUrl'] ?? $config->logo_image_url,
            'banner' => $bannerData,
            'contact_email' => $validated['contact_email'] ?? $validated['contactEmail'] ?? $config->contact_email,
            'contact_phone' => $validated['contact_phone'] ?? $validated['contactPhone'] ?? $config->contact_phone,
            'address' => $validated['address'] ?? $config->address,
            'social_links' => $validated['social_links'] ?? $validated['socialLinks'] ?? $config->social_links,
            'footer' => $footerConfig ?? $config->footer,
            'seo' => $seoConfig ?? $config->seo,
        ];

        if ($hasHeaderColumn) {
            $payload['header_config'] = $headerConfig ?? $config->header_config;
        }

        $config->update($payload);

        $responseData = $config->fresh()->toArray();
        if (!$hasHeaderColumn && isset($bannerData['header_config'])) {
            $responseData['header_config'] = $bannerData['header_config'];
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật cấu hình website thành công',
            'data' => $responseData,
        ]);
    }
}
