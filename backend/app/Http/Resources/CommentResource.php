<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'article_id' => $this->article_id,
            'parent_id' => $this->parent_id,
            'content' => $this->content,
            'status' => $this->status,
            'user' => new UserResource($this->whenLoaded('user')),
            'article' => $this->whenLoaded('article', fn () => [
                'id' => $this->article?->id,
                'title' => $this->article?->title,
                'slug' => $this->article?->slug,
            ]),
            'replies' => CommentResource::collection($this->whenLoaded('replies')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
