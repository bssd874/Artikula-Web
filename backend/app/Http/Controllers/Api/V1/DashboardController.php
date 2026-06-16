<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use RespondsWithApi;

    public function writer(Request $request)
    {
        $articles = Article::where('user_id', $request->user()->id);

        $latest = (clone $articles)
            ->with(['author', 'category', 'tags'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->limit(5)
            ->get();

        return $this->success([
            'total_articles' => (clone $articles)->count(),
            'draft_articles' => (clone $articles)->where('status', Article::STATUS_DRAFT)->count(),
            'pending_review_articles' => (clone $articles)->where('status', Article::STATUS_PENDING_REVIEW)->count(),
            'published_articles' => (clone $articles)->where('status', Article::STATUS_PUBLISHED)->count(),
            'total_views' => (clone $articles)->sum('view_count'),
            'total_likes' => DB::table('likes')->whereIn('article_id', (clone $articles)->select('id'))->count(),
            'total_comments' => DB::table('comments')->whereIn('article_id', (clone $articles)->select('id'))->count(),
            'latest_articles' => ArticleResource::collection($latest),
        ], 'Dashboard penulis berhasil diambil');
    }

    public function editor()
    {
        return $this->success([
            'pending_review' => Article::where('status', Article::STATUS_PENDING_REVIEW)->count(),
            'revision' => Article::where('status', Article::STATUS_REVISION)->count(),
            'approved' => Article::where('status', Article::STATUS_PUBLISHED)->count(),
            'rejected' => Article::where('status', Article::STATUS_REJECTED)->count(),
            'latest_reviews' => ArticleResource::collection(
                Article::whereIn('status', [Article::STATUS_PENDING_REVIEW, Article::STATUS_REVISION])
                    ->with(['author', 'category', 'tags', 'latestReview'])
                    ->latest()
                    ->limit(10)
                    ->get()
            ),
        ], 'Dashboard editor berhasil diambil');
    }

    public function admin()
    {
        $popular = Article::published()
            ->with(['author', 'category', 'tags'])
            ->withCount(['likes', 'comments'])
            ->orderByDesc('view_count')
            ->limit(5)
            ->get();

        $activeAuthors = User::whereIn('role', [User::ROLE_WRITER, User::ROLE_EDITOR, User::ROLE_ADMIN])
            ->withCount('articles')
            ->orderByDesc('articles_count')
            ->limit(5)
            ->get();

        return $this->success([
            'total_users' => User::count(),
            'total_writers' => User::whereIn('role', [User::ROLE_WRITER, User::ROLE_EDITOR, User::ROLE_ADMIN])->count(),
            'total_articles' => Article::count(),
            'published_articles' => Article::where('status', Article::STATUS_PUBLISHED)->count(),
            'total_categories' => Category::count(),
            'total_comments' => Comment::count(),
            'total_article_views' => Article::sum('view_count'),
            'popular_articles' => ArticleResource::collection($popular),
            'active_authors' => $activeAuthors->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
                'articles_count' => $user->articles_count,
            ]),
        ], 'Dashboard administrator berhasil diambil');
    }
}
