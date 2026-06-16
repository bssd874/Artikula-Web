<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $plainText = trim(strip_tags($this->content ?? ''));
        $wordCount = str_word_count($plainText);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when(
                $request->routeIs('articles.show', 'reviews.show', 'my-articles.show', 'admin.articles.index'),
                $this->content,
            ),
            'thumbnail' => $this->thumbnail,
            'status' => $this->status,
            'allow_comments' => $this->allow_comments,
            'view_count' => $this->view_count,
            'read_time' => max(1, (int) ceil($wordCount / 200)),
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'author' => new UserResource($this->whenLoaded('author')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'latest_review' => $this->whenLoaded('latestReview', fn () => [
                'previous_status' => $this->latestReview?->previous_status,
                'new_status' => $this->latestReview?->new_status,
                'notes' => $this->latestReview?->notes,
                'created_at' => $this->latestReview?->created_at?->toISOString(),
            ]),
            'likes_count' => $this->whenCounted('likes'),
            'comments_count' => $this->whenCounted('comments'),
            'bookmarks_count' => $this->whenCounted('bookmarks'),
            'is_liked' => $this->when($user !== null, fn () => $this->likes()->where('user_id', $user->id)->exists()),
            'is_bookmarked' => $this->when($user !== null, fn () => $this->bookmarks()->where('user_id', $user->id)->exists()),
            'seo' => [
                'title' => $this->title,
                'description' => Str::limit($this->excerpt, 155, ''),
                'canonical' => config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')).'/articles/'.$this->slug,
            ],
        ];
    }
}
