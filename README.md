# Artikula

Artikula adalah project website publikasi dan manajemen artikel berdasarkan PRD: React/Vite untuk frontend, Laravel REST API untuk backend, PostgreSQL sebagai database utama, dan Laravel Sanctum untuk autentikasi token.

## Struktur

```text
backend/   Laravel API, Sanctum, migrations, seeders, tests
frontend/  React + Vite + Tailwind, routing publik dan dashboard role
```

## Fitur MVP

- Auth register, login, logout, forgot/reset password, dan profil.
- Role `reader`, `writer`, `editor`, `admin`.
- Artikel publik dengan search, kategori, tag, sort terbaru/populer, detail, metadata SEO dasar.
- Workflow artikel: draft, pending review, revision, published, rejected, archived.
- Dashboard writer, editor, admin.
- Komentar, like, bookmark, dan report.
- Admin users, articles, categories, tags, comments, reports.
- Seeder demo dan feature test workflow API.

## Setup Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan storage:link
```

Untuk PostgreSQL lokal:

```bash
docker compose up -d postgres
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Untuk mode cepat tanpa PostgreSQL, ubah `.env` backend:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Lalu jalankan:

```bash
New-Item -ItemType File -Force database/database.sqlite
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000
```

## Setup Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend berjalan di `http://localhost:5173` dan API default di `http://localhost:8000/api/v1`.

## Akun Demo

Semua password: `password`

| Role | Email |
| --- | --- |
| Reader | `reader@artikula.test` |
| Writer | `writer@artikula.test` |
| Editor | `editor@artikula.test` |
| Admin | `admin@artikula.test` |

## Verifikasi

```bash
cd backend
php artisan test

cd ../frontend
npm run build
```

Catatan: build frontend saat ini memberi warning chunk besar karena TipTap/Recharts masuk bundle utama. Build tetap sukses; code splitting bisa ditambahkan saat optimasi produksi.
