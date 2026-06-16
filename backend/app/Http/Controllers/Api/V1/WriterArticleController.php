<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ArticleWorkflowService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WriterArticleController extends Controller
{
    use RespondsWithApi;

    public function __construct(private readonly ArticleWorkflowService $workflow) {}

    public function index(Request $request)
    {
        $query = Article::where('user_id', $request->user()->id)
            ->with(['author', 'category', 'tags', 'latestReview'])
            ->withCount(['likes', 'comments', 'bookmarks'])
            ->latest();

        $query->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')));

        return $this->paginated(
            $query->paginate(min($request->integer('per_page', 10), 50)),
            ArticleResource::class,
            'Artikel penulis berhasil diambil',
        );
    }

    public function store(Request $request)
    {
        $data = $this->validatedArticle($request);

        $article = Article::create([
            ...$data,
            'user_id' => $request->user()->id,
            'slug' => $this->workflow->uniqueSlug($data['title']),
            'content' => $this->workflow->sanitizeHtml($data['content']),
            'status' => Article::STATUS_DRAFT,
        ]);

        $article->tags()->sync($data['tag_ids'] ?? []);

        return $this->success(
            new ArticleResource($article->load(['author', 'category', 'tags'])->loadCount(['likes', 'comments', 'bookmarks'])),
            'Artikel berhasil dibuat sebagai draft',
            Response::HTTP_CREATED,
        );
    }

    public function show(Request $request, Article $article)
    {
        if (! $this->canManage($request, $article)) {
            return $this->error('Anda tidak memiliki izin untuk melihat artikel ini.', Response::HTTP_FORBIDDEN);
        }

        return $this->success(
            new ArticleResource($article->load(['author', 'category', 'tags', 'latestReview'])->loadCount(['likes', 'comments', 'bookmarks'])),
            'Detail artikel penulis berhasil diambil',
        );
    }

    public function update(Request $request, Article $article)
    {
        if (! $this->canManage($request, $article)) {
            return $this->error('Anda tidak memiliki izin untuk memperbarui artikel ini.', Response::HTTP_FORBIDDEN);
        }

        if ($article->isLockedForWriter() && ! $request->user()->isEditor()) {
            return $this->error('Artikel yang sedang direview tidak dapat diedit.', Response::HTTP_CONFLICT);
        }

        $data = $this->validatedArticle($request, partial: true);
        $payload = $data;

        if (array_key_exists('title', $data)) {
            $payload['slug'] = $this->workflow->uniqueSlug($data['title'], $article->id);
        }

        if (array_key_exists('content', $data)) {
            $payload['content'] = $this->workflow->sanitizeHtml($data['content']);
        }

        $article->update($payload);

        if (array_key_exists('tag_ids', $data)) {
            $article->tags()->sync($data['tag_ids'] ?? []);
        }

        return $this->success(
            new ArticleResource($article->fresh()->load(['author', 'category', 'tags', 'latestReview'])->loadCount(['likes', 'comments', 'bookmarks'])),
            'Artikel berhasil diperbarui',
        );
    }

    public function destroy(Request $request, Article $article)
    {
        if (! $this->canManage($request, $article)) {
            return $this->error('Anda tidak memiliki izin untuk menghapus artikel ini.', Response::HTTP_FORBIDDEN);
        }

        $article->delete();

        return $this->success(null, 'Artikel berhasil dihapus');
    }

    public function submit(Request $request, Article $article)
    {
        if ($article->user_id !== $request->user()->id && ! $request->user()->isEditor()) {
            return $this->error('Anda tidak memiliki izin untuk mengirim artikel ini.', Response::HTTP_FORBIDDEN);
        }

        if (! in_array($article->status, [Article::STATUS_DRAFT, Article::STATUS_REVISION, Article::STATUS_REJECTED], true)) {
            return $this->error('Artikel tidak dapat dikirim untuk review dari status saat ini.', Response::HTTP_CONFLICT);
        }

        if (! $article->title || ! $article->excerpt || ! $article->content || ! $article->category_id) {
            return $this->error('Lengkapi data wajib artikel sebelum dikirim untuk review.', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $previousStatus = $article->status;
        $article->update(['status' => Article::STATUS_PENDING_REVIEW]);
        $this->workflow->recordStatusChange($article, $request->user()->id, $previousStatus, Article::STATUS_PENDING_REVIEW, 'Artikel dikirim untuk review.');

        return $this->success(
            new ArticleResource($article->fresh()->load(['author', 'category', 'tags', 'latestReview'])->loadCount(['likes', 'comments', 'bookmarks'])),
            'Artikel berhasil dikirim untuk review',
        );
    }

    public function archive(Request $request, Article $article)
    {
        if (! $this->canManage($request, $article)) {
            return $this->error('Anda tidak memiliki izin untuk mengarsipkan artikel ini.', Response::HTTP_FORBIDDEN);
        }

        $previousStatus = $article->status;
        $article->update(['status' => Article::STATUS_ARCHIVED]);
        $this->workflow->recordStatusChange($article, $request->user()->id, $previousStatus, Article::STATUS_ARCHIVED, 'Artikel diarsipkan.');

        return $this->success(new ArticleResource($article->fresh()->load(['author', 'category', 'tags', 'latestReview'])), 'Artikel berhasil diarsipkan');
    }

    private function canManage(Request $request, Article $article): bool
    {
        return $article->user_id === $request->user()->id || $request->user()->isEditor();
    }

    private function validatedArticle(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'excerpt' => [$required, 'string'],
            'content' => [$required, 'string'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'category_id' => [$required, 'integer', 'exists:categories,id'],
            'allow_comments' => ['sometimes', 'boolean'],
            'tag_ids' => ['sometimes', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'status' => ['prohibited'],
        ]);
    }
}
