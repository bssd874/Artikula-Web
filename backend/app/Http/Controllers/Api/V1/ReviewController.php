<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ArticleWorkflowService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReviewController extends Controller
{
    use RespondsWithApi;

    public function __construct(private readonly ArticleWorkflowService $workflow) {}

    public function index(Request $request)
    {
        $query = Article::whereIn('status', [Article::STATUS_PENDING_REVIEW, Article::STATUS_REVISION])
            ->with(['author', 'category', 'tags', 'latestReview'])
            ->withCount(['likes', 'comments'])
            ->latest();

        $query->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')));

        return $this->paginated(
            $query->paginate(min($request->integer('per_page', 10), 50)),
            ArticleResource::class,
            'Daftar artikel review berhasil diambil',
        );
    }

    public function show(Article $article)
    {
        return $this->success(
            new ArticleResource($article->load(['author', 'category', 'tags', 'latestReview'])->loadCount(['likes', 'comments', 'bookmarks'])),
            'Detail artikel review berhasil diambil',
        );
    }

    public function approve(Request $request, Article $article)
    {
        if ($article->status !== Article::STATUS_PENDING_REVIEW) {
            return $this->error('Hanya artikel pending review yang dapat disetujui.', Response::HTTP_CONFLICT);
        }

        $previousStatus = $article->status;
        $article->update([
            'status' => Article::STATUS_PUBLISHED,
            'published_at' => now(),
        ]);
        $this->workflow->recordStatusChange($article, $request->user()->id, $previousStatus, Article::STATUS_PUBLISHED, $request->string('notes')->toString() ?: 'Artikel disetujui.');

        return $this->success(new ArticleResource($article->fresh()->load(['author', 'category', 'tags', 'latestReview'])), 'Artikel berhasil dipublikasikan');
    }

    public function revision(Request $request, Article $article)
    {
        $data = $request->validate(['notes' => ['required', 'string', 'max:2000']]);

        return $this->moveToStatus($request, $article, Article::STATUS_REVISION, $data['notes'], 'Artikel berhasil dikembalikan untuk revisi');
    }

    public function reject(Request $request, Article $article)
    {
        $data = $request->validate(['notes' => ['required', 'string', 'max:2000']]);

        return $this->moveToStatus($request, $article, Article::STATUS_REJECTED, $data['notes'], 'Artikel berhasil ditolak');
    }

    private function moveToStatus(Request $request, Article $article, string $status, string $notes, string $message)
    {
        if ($article->status !== Article::STATUS_PENDING_REVIEW) {
            return $this->error('Hanya artikel pending review yang dapat diproses.', Response::HTTP_CONFLICT);
        }

        $previousStatus = $article->status;
        $article->update(['status' => $status]);
        $this->workflow->recordStatusChange($article, $request->user()->id, $previousStatus, $status, $notes);

        return $this->success(new ArticleResource($article->fresh()->load(['author', 'category', 'tags', 'latestReview'])), $message);
    }
}
