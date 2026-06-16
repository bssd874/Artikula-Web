<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ArticleWorkflowService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminArticleController extends Controller
{
    use RespondsWithApi;

    public function __construct(private readonly ArticleWorkflowService $workflow) {}

    public function index(Request $request)
    {
        $query = Article::with(['author', 'category', 'tags', 'latestReview'])
            ->withCount(['likes', 'comments', 'bookmarks'])
            ->latest();

        $query->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')));
        $query->when($request->filled('category_id'), fn ($query) => $query->where('category_id', $request->integer('category_id')));

        return $this->paginated(
            $query->paginate(min($request->integer('per_page', 15), 100)),
            ArticleResource::class,
            'Daftar artikel admin berhasil diambil',
        );
    }

    public function updateStatus(Request $request, Article $article)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(Article::STATUSES)],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $previousStatus = $article->status;
        $article->update([
            'status' => $data['status'],
            'published_at' => $data['status'] === Article::STATUS_PUBLISHED ? ($article->published_at ?? now()) : $article->published_at,
        ]);

        $this->workflow->recordStatusChange($article, $request->user()->id, $previousStatus, $data['status'], $data['notes'] ?? 'Status artikel diubah admin.');

        return $this->success(new ArticleResource($article->fresh()->load(['author', 'category', 'tags', 'latestReview'])), 'Status artikel berhasil diperbarui');
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return $this->success(null, 'Artikel berhasil dihapus admin');
    }
}
