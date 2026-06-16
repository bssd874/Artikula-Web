<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\UserResource;
use App\Models\Article;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    use RespondsWithApi;

    public function show(Request $request)
    {
        return $this->success(new UserResource($request->user()), 'Profil berhasil diambil');
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'alpha_dash:ascii', 'max:50', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url', 'max:255'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        return $this->success(new UserResource($user->fresh()), 'Profil berhasil diperbarui');
    }

    public function author(string $username)
    {
        $author = User::where('username', $username)
            ->whereIn('role', [User::ROLE_WRITER, User::ROLE_EDITOR, User::ROLE_ADMIN])
            ->firstOrFail();

        $articles = Article::published()
            ->whereBelongsTo($author, 'author')
            ->with(['author', 'category', 'tags'])
            ->withCount(['likes', 'comments'])
            ->latest('published_at')
            ->paginate(10);

        return $this->success([
            'author' => new UserResource($author),
            'articles' => ArticleResource::collection($articles->getCollection()),
        ], 'Profil penulis berhasil diambil', 200, [
            'current_page' => $articles->currentPage(),
            'last_page' => $articles->lastPage(),
            'per_page' => $articles->perPage(),
            'total' => $articles->total(),
        ]);
    }
}
