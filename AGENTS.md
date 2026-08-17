# Quy tắc & Quy chuẩn Lập trình (AGENTS.md)

Tài liệu này tổng hợp toàn bộ quy chuẩn kiến trúc, quy trình phát triển và tiêu chuẩn code cho cả **Backend (Laravel API)** và **Frontend (React / Next.js SPA)** của dự án **Mạch Quan Họ**.

---

## 1. Cấu trúc Tổng quan Dự án

```
d:\Sources\machquanho\
├── api/                   # Backend Laravel 11 REST API + MySQL + JWT Auth
│   ├── app/Http/Controllers/Api/   # REST Controllers (Auth, Article, Category, Research, Artisan, SiteConfig, User)
│   ├── app/Models/                 # Eloquent Models (User, Article, Category, ResearchEntry, Artisan, ExploreTopic, SiteConfig)
│   ├── database/migrations/        # MySQL Database Migrations
│   ├── database/seeders/           # Database Seeders
│   └── routes/api.php              # RESTful API Endpoints (/api/auth/*, /api/admin/*, /api/*)
└── client/                # Frontend React + Vite + Tailwind CSS SPA
    ├── src/services/               # API Clients (axios base, JWT token header)
    ├── src/components/             # UI Components (Navbar, Footer, AudioPlayer, Modals)
    ├── src/views/                  # Pages (HomePage, NewsListPage, ArticleDetailPage, ResearchDiaryPage, AboutPage, AdminPortal)
    └── src/types.ts                # TypeScript Interfaces & DTOs
```

---

## 2. Quy trình chuẩn khi thêm Module / Feature mới

Khi phát triển hoặc mở rộng 1 tính năng mới (ví dụ: `News`, `Promotion`, `Category`), thực hiện đúng thứ tự 6 bước:

1. **Database & Entity (Backend):**
   - Tạo class Model trong `api/app/Models/`.
   - Cập nhật database migration trong `api/database/migrations/` và thực thi `php artisan migrate`.

2. **Repository / Service (Backend):**
   - Xử lý logic truy xuất dữ liệu trong Controller/Service của Laravel, áp dụng `PagedList`, `SearchBase` khi cần tìm kiếm & phân trang.

3. **Controller & API Endpoints (Backend):**
   - Định nghĩa Controller tại `api/app/Http/Controllers/Api/`.
   - Đăng ký route trong `api/routes/api.php` với cả route public (Client đọc) và route bảo mật `auth:api` (Admin CRUD).

4. **API Client Service (Frontend):**
   - Tạo file service trong `client/src/services/` sử dụng `axiosBase` / `ApiService`.
   - Định nghĩa chính xác TypeScript types tương ứng DTOs của Backend.

5. **View & UI Components (Frontend):**
   - Xây dựng hoặc tích hợp màn hình danh sách, form Thêm/Sửa, và chi tiết vào `client/src/views/` hoặc `client/src/components/`.

---

## 3. Quy chuẩn Backend API (Laravel / C# ASP.NET / REST)

### 3.1. Controller Rules
- Route chuẩn: Public APIs dưới `/api/{resource}`, Admin APIs dưới `/api/admin/{resource}` (bảo vệ bởi middleware `auth:api`).
- Trả về JSON chuẩn theo định dạng `ApiResponse<T>`:
  ```json
  {
    "status": "success",
    "data": { ... },
    "message": "Notification message"
  }
  ```
- Luôn sử dụng `try-catch` và ghi log khi gặp lỗi hệ thống.

### 3.2. Truy vấn, Phân trang & Join
- **Phân trang**: Mọi API lấy danh sách có lọc chấp nhận `pageIndex`, `pageSize`, `sortColumn`, `sortOrder` và các trường filter.
- **Search Query**: Chuỗi tìm kiếm sử dụng `LIKE %query%` trên các trường tiêu đề, slug, tóm tắt.
- **Join / Relationships**: Sử dụng Eloquent Relationship (`belongsTo`, `hasMany`) hoặc LINQ join với `AsNoTracking()` cho các truy vấn chỉ đọc.

---

## 4. Quy chuẩn Frontend Client (React / Next.js / Vite SPA)

### 4.1. Gọi API & State Management
- Mọi request HTTP sử dụng `ApiService` / `axiosBase` đã cấu hình `withCredentials` và tự động gắn token `Authorization: Bearer <token>` nếu có.
- Quản lý state gọn gàng: tách riêng state danh sách, bộ lọc `searchParams`, và trạng thái modal (Tạo / Sửa / Xóa / Chi tiết).

### 4.2. UI & Component Standard
- Theme màu chủ đạo: Tông màu văn hóa di sản Kinh Bắc (`#FAF8F5` nền sáng, `#2D241E` chữ, `#007f32` điểm nhấn xanh lá di sản hoặc `#8B263E` đỏ son).
- Sử dụng Toast notification để phản hồi thao tác người dùng (Thành công / Lỗi).
- Rich Text Editor: Dùng `<Editor />` cho các trường nhập nội dung HTML / bài viết chi tiết.

---

## 5. Danh sách Bảng CSDL và API Endpoints

| Bảng CSDL | Endpoint Client (Public) | Endpoint Admin (Protected `auth:api`) |
|---|---|---|
| `users` | `POST /api/auth/login`, `POST /api/auth/register` | `GET /api/auth/me`, `POST /api/admin/users/GetData` |
| `categories` | `GET /api/categories` | `POST /api/admin/categories/GetData`, `POST /api/admin/categories` |
| `articles` | `GET /api/articles`, `GET /api/articles/{slug}` | `POST /api/admin/articles/GetData`, `POST /api/admin/articles` |
| `research_entries` | `GET /api/research-entries` | `POST /api/admin/research-entries/GetData` |
| `artisans` | `GET /api/artisans` | `POST /api/admin/artisans/GetData` |
| `explore_topics` | `GET /api/explore-topics` | `POST /api/admin/explore-topics/GetData` |
| `site_configs` | `GET /api/site-config` | `POST /api/admin/site-config` |
