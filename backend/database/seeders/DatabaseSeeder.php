<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Bookmark;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $users = collect([
            ['name' => 'Rani Pembaca', 'username' => 'rani', 'email' => 'reader@artikula.test', 'role' => User::ROLE_READER],
            ['name' => 'Bagas Penulis', 'username' => 'bagas', 'email' => 'writer@artikula.test', 'role' => User::ROLE_WRITER],
            ['name' => 'Citra Editor', 'username' => 'citra', 'email' => 'editor@artikula.test', 'role' => User::ROLE_EDITOR],
            ['name' => 'Adi Admin', 'username' => 'admin', 'email' => 'admin@artikula.test', 'role' => User::ROLE_ADMIN],
        ])->mapWithKeys(function (array $user): array {
            $model = User::updateOrCreate(
                ['email' => $user['email']],
                [
                    ...$user,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'bio' => "Akun demo {$user['role']} untuk Artikula.",
                    'website' => 'https://artikula.local',
                    'is_active' => true,
                ],
            );

            return [$user['role'] => $model];
        });

        $categories = collect([
            ['name' => 'Teknologi', 'description' => 'Artikel tentang produk digital, web, dan perangkat lunak.'],
            ['name' => 'Bisnis', 'description' => 'Strategi bisnis, operasional, dan produktivitas.'],
            ['name' => 'Pendidikan', 'description' => 'Pembelajaran, riset, dan pengembangan kompetensi.'],
            ['name' => 'Kesehatan', 'description' => 'Kebiasaan sehat dan kualitas hidup.'],
        ])->mapWithKeys(fn (array $category): array => [
            $category['name'] => Category::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                $category + ['slug' => Str::slug($category['name'])],
            ),
        ]);

        $tags = collect(['React', 'Laravel', 'PostgreSQL', 'Web Development', 'Produktivitas', 'AI'])
            ->mapWithKeys(fn (string $name): array => [
                $name => Tag::updateOrCreate(['slug' => Str::slug($name)], ['name' => $name, 'slug' => Str::slug($name)]),
            ]);

        $articleData = [
            [
                'title' => 'Membangun Workflow Review Artikel yang Rapi',
                'category' => 'Teknologi',
                'tags' => ['Laravel', 'PostgreSQL', 'Web Development'],
                'status' => Article::STATUS_PUBLISHED,
                'thumbnail' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
                'excerpt' => 'Review konten yang jelas membantu tim editorial menjaga kualitas publikasi tanpa memperlambat penulis.',
            ],
            [
                'title' => 'React Query untuk Daftar Artikel Responsif',
                'category' => 'Teknologi',
                'tags' => ['React', 'Web Development'],
                'status' => Article::STATUS_PUBLISHED,
                'thumbnail' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
                'excerpt' => 'Strategi fetching, caching, dan pagination agar pengalaman membaca terasa cepat.',
            ],
            [
                'title' => 'Cara Menyusun Kalender Konten untuk Tim Kecil',
                'category' => 'Bisnis',
                'tags' => ['Produktivitas'],
                'status' => Article::STATUS_PENDING_REVIEW,
                'thumbnail' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
                'excerpt' => 'Kalender konten membuat prioritas editorial lebih mudah dipantau dan dievaluasi.',
            ],
            [
                'title' => 'Checklist Keamanan Upload Gambar',
                'category' => 'Teknologi',
                'tags' => ['Laravel', 'Web Development'],
                'status' => Article::STATUS_REVISION,
                'thumbnail' => 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
                'excerpt' => 'Upload file harus divalidasi dari MIME type, ukuran, hingga lokasi penyimpanan.',
            ],
        ];

        $articles = collect($articleData)->map(function (array $item) use ($users, $categories, $tags): Article {
            $article = Article::updateOrCreate(
                ['slug' => Str::slug($item['title'])],
                [
                    'user_id' => $users[User::ROLE_WRITER]->id,
                    'category_id' => $categories[$item['category']]->id,
                    'title' => $item['title'],
                    'slug' => Str::slug($item['title']),
                    'excerpt' => $item['excerpt'],
                    'content' => $this->articleContent($item['title']),
                    'thumbnail' => $item['thumbnail'],
                    'status' => $item['status'],
                    'allow_comments' => true,
                    'view_count' => $item['status'] === Article::STATUS_PUBLISHED ? fake()->numberBetween(80, 900) : 0,
                    'published_at' => $item['status'] === Article::STATUS_PUBLISHED ? now()->subDays(fake()->numberBetween(1, 12)) : null,
                ],
            );

            $article->tags()->sync(collect($item['tags'])->map(fn (string $name): int => $tags[$name]->id)->all());

            return $article;
        });

        $published = $articles->where('status', Article::STATUS_PUBLISHED);

        $published->each(function (Article $article) use ($users): void {
            Comment::firstOrCreate(
                ['article_id' => $article->id, 'user_id' => $users[User::ROLE_READER]->id, 'content' => 'Pembahasannya jelas dan mudah diterapkan.'],
                ['status' => Comment::STATUS_VISIBLE],
            );

            Like::firstOrCreate(['article_id' => $article->id, 'user_id' => $users[User::ROLE_READER]->id]);
            Bookmark::firstOrCreate(['article_id' => $article->id, 'user_id' => $users[User::ROLE_READER]->id]);
        });
    }

    private function articleContent(string $title): string
    {
        return <<<HTML
<h2>{$title}</h2>
<p>Artikel ini disusun sebagai contoh konten untuk MVP Artikula. Struktur paragraf, heading, list, kutipan, dan kode dapat disimpan dari rich text editor.</p>
<p>Tim editorial dapat memeriksa kelengkapan data, kejelasan argumen, dan keamanan konten sebelum publikasi.</p>
<blockquote>Konten yang rapi mempercepat proses review tanpa mengurangi kualitas publikasi.</blockquote>
<ul>
  <li>Judul dan ringkasan harus jelas.</li>
  <li>Kategori wajib dipilih.</li>
  <li>Konten harus bebas script berbahaya.</li>
</ul>
HTML;
    }
}
