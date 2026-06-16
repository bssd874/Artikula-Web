<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CommentController extends Controller
{
    use RespondsWithApi;

    public function index(Article $article)
    {
        $comments = $article->comments()
            ->whereNull('parent_id')
            ->where('status', Comment::STATUS_VISIBLE)
            ->with(['user', 'replies' => fn ($query) => $query->where('status', Comment::STATUS_VISIBLE)->with('user')])
            ->latest()
            ->get();

        return $this->success(CommentResource::collection($comments), 'Daftar komentar berhasil diambil');
    }

    public function mine(Request $request)
    {
        $comments = $request->user()
            ->comments()
            ->with(['article.author', 'article.category', 'user'])
            ->latest()
            ->paginate(min($request->integer('per_page', 10), 50));

        return $this->paginated($comments, CommentResource::class, 'Daftar komentar saya berhasil diambil');
    }

    public function adminIndex(Request $request)
    {
        $comments = Comment::with(['user', 'article'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->latest()
            ->paginate(min($request->integer('per_page', 15), 100));

        return $this->paginated($comments, CommentResource::class, 'Daftar komentar admin berhasil diambil');
    }

    public function store(Request $request, Article $article)
    {
        if ($article->status !== Article::STATUS_PUBLISHED || ! $article->allow_comments) {
            return $this->error('Komentar untuk artikel ini tidak tersedia.', Response::HTTP_CONFLICT);
        }

        $data = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'integer', 'exists:comments,id'],
        ]);

        $comment = $article->comments()->create([
            'user_id' => $request->user()->id,
            'parent_id' => $data['parent_id'] ?? null,
            'content' => trim(strip_tags($data['content'])),
            'status' => Comment::STATUS_VISIBLE,
        ]);

        return $this->success(new CommentResource($comment->load('user')), 'Komentar berhasil dibuat', Response::HTTP_CREATED);
    }

    public function update(Request $request, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return $this->error('Anda hanya dapat mengubah komentar sendiri.', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validate(['content' => ['required', 'string', 'max:1000']]);
        $comment->update(['content' => trim(strip_tags($data['content']))]);

        return $this->success(new CommentResource($comment->fresh()->load('user')), 'Komentar berhasil diperbarui');
    }

    public function destroy(Request $request, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return $this->error('Anda tidak memiliki izin untuk menghapus komentar ini.', Response::HTTP_FORBIDDEN);
        }

        $comment->delete();

        return $this->success(null, 'Komentar berhasil dihapus');
    }

    public function hide(Comment $comment)
    {
        $comment->update(['status' => Comment::STATUS_HIDDEN]);

        return $this->success(new CommentResource($comment->fresh()->load('user')), 'Komentar berhasil disembunyikan');
    }
}
