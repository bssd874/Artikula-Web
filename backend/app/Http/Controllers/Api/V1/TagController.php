<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\TagResource;
use App\Models\Article;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class TagController extends Controller
{
    use RespondsWithApi;

    public function index()
    {
        return $this->success(
            TagResource::collection(Tag::withCount(['articles' => fn ($query) => $query->published()])->orderBy('name')->get()),
            'Daftar tag berhasil diambil',
        );
    }

    public function show(string $slug)
    {
        $tag = Tag::where('slug', $slug)->withCount(['articles' => fn ($query) => $query->published()])->firstOrFail();
        $articles = Article::published()
            ->whereHas('tags', fn ($query) => $query->whereKey($tag->id))
            ->with(['author', 'category', 'tags'])
            ->withCount(['likes', 'comments'])
            ->latest('published_at')
            ->paginate(10);

        return $this->success([
            'tag' => new TagResource($tag),
            'articles' => ArticleResource::collection($articles->getCollection()),
        ], 'Detail tag berhasil diambil', Response::HTTP_OK, [
            'current_page' => $articles->currentPage(),
            'last_page' => $articles->lastPage(),
            'per_page' => $articles->perPage(),
            'total' => $articles->total(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100', 'unique:tags,name']]);
        $tag = Tag::create(['name' => $data['name'], 'slug' => $this->uniqueSlug($data['name'])]);

        return $this->success(new TagResource($tag), 'Tag berhasil dibuat', Response::HTTP_CREATED);
    }

    public function update(Request $request, Tag $tag)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100', Rule::unique('tags')->ignore($tag->id)]]);
        $tag->update(['name' => $data['name'], 'slug' => $this->uniqueSlug($data['name'], $tag->id)]);

        return $this->success(new TagResource($tag->fresh()), 'Tag berhasil diperbarui');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return $this->success(null, 'Tag berhasil dihapus');
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: Str::random(8);
        $slug = $base;
        $counter = 2;

        while (Tag::where('slug', $slug)->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
