<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    use RespondsWithApi;

    public function index()
    {
        $categories = Category::withCount(['articles' => fn ($query) => $query->published()])
            ->orderBy('name')
            ->get();

        return $this->success(CategoryResource::collection($categories), 'Daftar kategori berhasil diambil');
    }

    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)->withCount(['articles' => fn ($query) => $query->published()])->firstOrFail();
        $articles = Article::published()
            ->whereBelongsTo($category)
            ->with(['author', 'category', 'tags'])
            ->withCount(['likes', 'comments'])
            ->latest('published_at')
            ->paginate(10);

        return $this->success([
            'category' => new CategoryResource($category),
            'articles' => ArticleResource::collection($articles->getCollection()),
        ], 'Detail kategori berhasil diambil', Response::HTTP_OK, [
            'current_page' => $articles->currentPage(),
            'last_page' => $articles->lastPage(),
            'per_page' => $articles->perPage(),
            'total' => $articles->total(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        $category = Category::create([
            ...$data,
            'slug' => $this->uniqueSlug($data['name']),
        ]);

        return $this->success(new CategoryResource($category), 'Kategori berhasil dibuat', Response::HTTP_CREATED);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('categories')->ignore($category->id)],
            'description' => ['nullable', 'string'],
        ]);

        $category->update([
            ...$data,
            'slug' => $this->uniqueSlug($data['name'], $category->id),
        ]);

        return $this->success(new CategoryResource($category->fresh()), 'Kategori berhasil diperbarui');
    }

    public function destroy(Category $category)
    {
        if ($category->articles()->exists()) {
            return $this->error('Kategori tidak dapat dihapus karena masih digunakan artikel.', Response::HTTP_CONFLICT);
        }

        $category->delete();

        return $this->success(null, 'Kategori berhasil dihapus');
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: Str::random(8);
        $slug = $base;
        $counter = 2;

        while (Category::where('slug', $slug)->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
