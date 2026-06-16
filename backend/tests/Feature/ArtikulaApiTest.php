<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ArtikulaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_reader_and_returns_token(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Reader Baru',
            'username' => 'readerbaru',
            'email' => 'readerbaru@example.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.role', User::ROLE_READER)
            ->assertJsonStructure(['data' => ['token']]);
    }

    public function test_reader_cannot_access_admin_dashboard(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_READER]));

        $this->getJson('/api/v1/admin/dashboard')
            ->assertForbidden()
            ->assertJsonPath('success', false);
    }

    public function test_writer_editor_article_review_flow(): void
    {
        $writer = User::factory()->create(['role' => User::ROLE_WRITER]);
        $editor = User::factory()->create(['role' => User::ROLE_EDITOR]);
        $category = Category::create(['name' => 'Teknologi', 'slug' => 'teknologi']);
        $tag = Tag::create(['name' => 'Laravel', 'slug' => 'laravel']);

        Sanctum::actingAs($writer);

        $create = $this->postJson('/api/v1/articles', [
            'title' => 'Artikel Review Flow',
            'excerpt' => 'Ringkasan artikel untuk pengujian workflow.',
            'content' => '<p>Konten artikel workflow.</p><script>alert(1)</script>',
            'category_id' => $category->id,
            'tag_ids' => [$tag->id],
            'allow_comments' => true,
        ])->assertCreated();

        $articleId = $create->json('data.id');
        $this->assertDatabaseHas('articles', [
            'id' => $articleId,
            'status' => Article::STATUS_DRAFT,
        ]);
        $this->assertStringNotContainsString('<script>', Article::findOrFail($articleId)->content);

        $this->postJson("/api/v1/my/articles/{$articleId}/submit")
            ->assertOk()
            ->assertJsonPath('data.status', Article::STATUS_PENDING_REVIEW);

        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_READER]));

        $this->getJson('/api/v1/articles/artikel-review-flow')
            ->assertForbidden();

        Sanctum::actingAs($editor);

        $this->postJson("/api/v1/editor/reviews/{$articleId}/approve", ['notes' => 'Layak publish.'])
            ->assertOk()
            ->assertJsonPath('data.status', Article::STATUS_PUBLISHED);

        $this->getJson('/api/v1/articles/artikel-review-flow')
            ->assertOk()
            ->assertJsonPath('data.article.status', Article::STATUS_PUBLISHED);
    }
}
