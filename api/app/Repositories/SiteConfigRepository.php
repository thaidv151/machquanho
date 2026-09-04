<?php

namespace App\Repositories;

use App\Models\SiteConfig;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class SiteConfigRepository extends BaseRepository
{
    public function __construct(SiteConfig $model)
    {
        parent::__construct($model);
    }

    public function getPublicConfig(): array
    {
        $config = $this->model->newQuery()->first() ?? new SiteConfig([
            'site_name' => 'Mạch Quan Họ',
            'logo_type' => 'text',
            'logo_text' => 'Mạch Quan Họ',
            'logo_subtext' => 'Di sản Văn hóa Kinh Bắc',
        ]);

        $d = $config->toArray();

        if (!Schema::hasColumn('site_configs', 'header_config')) {
            $bannerData = is_array($config->banner) ? $config->banner : (json_decode($config->banner, true) ?? []);
            if (isset($bannerData['header_config'])) {
                $d['header_config'] = $bannerData['header_config'];
            }
        }

        return $d;
    }

    public function updateSiteConfig(array $validated): array
    {
        $config = $this->model->newQuery()->firstOrCreate(['id' => 1]);

        $headerConfig = $validated['header_config'] ?? $validated['headerConfig'] ?? $validated['header'] ?? null;
        $footerConfig = $validated['footer'] ?? null;
        $seoConfig = $validated['seo'] ?? null;
        $bannerInput = $validated['banner'] ?? $config->banner;
        $bannerData = is_array($bannerInput) ? $bannerInput : (json_decode($bannerInput, true) ?? []);

        $hasHeaderColumn = Schema::hasColumn('site_configs', 'header_config');

        if (!$hasHeaderColumn && $headerConfig !== null) {
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

        return $responseData;
    }
}
