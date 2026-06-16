<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PublicArticleController extends Controller
{
    use RespondsWithApi;

    public function index(Request $request)
    {
        $query = Article::published()
            ->with(['author', 'category', 'tags'])
            ->withCount(['likes', 'bookmarks', 'comments' => fn ($query) => $query->where('status', 'visible')]);

        $query->when($request->filled('q'), function ($query) use ($request): void {
            $keyword = $request->string('q')->toString();
            $query->where(function ($query) use ($keyword): void {
                $query->where('title', 'like', "%{$keyword}%")
                    ->orWhere('excerpt', 'like', "%{$keyword}%")
                    ->orWhere('content', 'like', "%{$keyword}%");
            });
        });

        $query->when($request->filled('category'), fn ($query) => $query->whereHas('category', fn ($category) => $category->where('slug', $request->string('category'))));
        $query->when($request->filled('tag'), fn ($query) => $query->whereHas('tags', fn ($tag) => $tag->where('slug', $request->string('tag'))));

        if ($request->string('sort')->toString() === 'popular') {
            $query->orderByDesc('likes_count')->orderByDesc('view_count');
        } else {
            $query->latest('published_at');
        }

        $articles = $query->paginate(min($request->integer('per_page', 10), 50));

        return $this->paginated($articles, ArticleResource::class, 'Daftar artikel berhasil diambil');
    }

    public function show(Request $request, string $slug)
    {
        $article = Article::where('slug', $slug)
            ->with([
                'author',
                'category',
                'tags',
                'latestReview',
                'comments' => fn ($query) => $query->whereNull('parent_id')->where('status', 'visible')->with(['user', 'replies.user']),
            ])
            ->withCount(['likes', 'bookmarks', 'comments' => fn ($query) => $query->where('status', 'visible')])
            ->firstOrFail();

        $user = $request->user();

        if ($article->status !== Article::STATUS_PUBLISHED && ! ($user && ($user->isEditor() || $article->user_id === $user->id))) {
            return $this->error('Anda tidak memiliki izin untuk melihat artikel ini.', Response::HTTP_FORBIDDEN);
        }

        if ($article->status === Article::STATUS_PUBLISHED) {
            $article->increment('view_count');
            $article->refresh();
        }

        $related = Article::published()
            ->whereKeyNot($article->id)
            ->where('category_id', $article->category_id)
            ->with(['author', 'category', 'tags'])
            ->withCount(['likes', 'comments'])
            ->latest('published_at')
            ->limit(3)
            ->get();

        return $this->success([
            'article' => new ArticleResource($article),
            'related' => ArticleResource::collection($related),
        ], 'Detail artikel berhasil diambil');
    }
}
