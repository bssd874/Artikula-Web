<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InteractionController extends Controller
{
    use RespondsWithApi;

    public function toggleLike(Request $request, Article $article)
    {
        if ($article->status !== Article::STATUS_PUBLISHED) {
            return $this->error('Artikel belum dipublikasikan.', Response::HTTP_CONFLICT);
        }

        $like = $article->likes()->where('user_id', $request->user()->id)->first();

        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            $article->likes()->create(['user_id' => $request->user()->id]);
            $liked = true;
        }

        return $this->success([
            'liked' => $liked,
            'likes_count' => $article->likes()->count(),
        ], $liked ? 'Artikel disukai' : 'Like artikel dibatalkan');
    }

    public function toggleBookmark(Request $request, Article $article)
    {
        if ($article->status !== Article::STATUS_PUBLISHED) {
            return $this->error('Artikel belum dipublikasikan.', Response::HTTP_CONFLICT);
        }

        $bookmark = $article->bookmarks()->where('user_id', $request->user()->id)->first();

        if ($bookmark) {
            $bookmark->delete();
            $bookmarked = false;
        } else {
            $article->bookmarks()->create(['user_id' => $request->user()->id]);
            $bookmarked = true;
        }

        return $this->success([
            'bookmarked' => $bookmarked,
            'bookmarks_count' => $article->bookmarks()->count(),
        ], $bookmarked ? 'Artikel disimpan' : 'Bookmark artikel dihapus');
    }

    public function bookmarks(Request $request)
    {
        $articles = Article::query()
            ->whereHas('bookmarks', fn ($query) => $query->where('user_id', $request->user()->id))
            ->with(['author', 'category', 'tags'])
            ->withCount(['likes', 'comments', 'bookmarks'])
            ->latest('published_at')
            ->paginate(min($request->integer('per_page', 10), 50));

        return $this->paginated($articles, ArticleResource::class, 'Daftar bookmark berhasil diambil');
    }
}
