<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SitemapController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sitemap.xml', [SitemapController::class, 'sitemapXml']);
Route::get('/robots.txt', [SitemapController::class, 'robotsTxt']);
