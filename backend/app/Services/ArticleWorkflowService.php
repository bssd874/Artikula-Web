<?php

namespace App\Services;

use App\Models\Article;
use Illuminate\Support\Str;

class ArticleWorkflowService
{
    public function uniqueSlug(string $title, ?int $ignoreArticleId = null): string
    {
        $base = Str::slug($title) ?: Str::random(8);
        $slug = $base;
        $counter = 2;

        while (Article::where('slug', $slug)
            ->when($ignoreArticleId, fn ($query) => $query->whereKeyNot($ignoreArticleId))
            ->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    public function sanitizeHtml(string $html): string
    {
        $allowedTags = '<p><br><strong><b><em><i><u><ol><ul><li><blockquote><a><img><pre><code><h1><h2><h3><h4><hr>';
        $clean = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $html) ?? '';
        $clean = preg_replace('/\son\w+=(["\']).*?\1/is', '', $clean) ?? '';
        $clean = preg_replace('/javascript:/i', '', $clean) ?? '';

        return trim(strip_tags($clean, $allowedTags));
    }

    public function recordStatusChange(Article $article, int $reviewerId, string $previousStatus, string $newStatus, ?string $notes = null): void
    {
        $article->reviews()->create([
            'reviewer_id' => $reviewerId,
            'previous_status' => $previousStatus,
            'new_status' => $newStatus,
            'notes' => $notes,
        ]);
    }
}
