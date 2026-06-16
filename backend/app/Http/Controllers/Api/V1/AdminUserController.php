<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    use RespondsWithApi;

    public function index(Request $request)
    {
        $query = User::query()->latest();

        $query->when($request->filled('q'), function ($query) use ($request): void {
            $keyword = $request->string('q')->toString();
            $query->where(function ($query) use ($keyword): void {
                $query->where('name', 'like', "%{$keyword}%")
                    ->orWhere('username', 'like', "%{$keyword}%")
                    ->orWhere('email', 'like', "%{$keyword}%");
            });
        });

        $query->when($request->filled('role'), fn ($query) => $query->where('role', $request->string('role')));

        return $this->paginated(
            $query->paginate(min($request->integer('per_page', 15), 100)),
            UserResource::class,
            'Daftar pengguna berhasil diambil',
        );
    }

    public function show(User $user)
    {
        return $this->success(new UserResource($user), 'Detail pengguna berhasil diambil');
    }

    public function updateRole(Request $request, User $user)
    {
        $data = $request->validate(['role' => ['required', Rule::in(User::ROLES)]]);
        $user->update(['role' => $data['role']]);

        return $this->success(new UserResource($user->fresh()), 'Role pengguna berhasil diperbarui');
    }

    public function updateStatus(Request $request, User $user)
    {
        $data = $request->validate(['is_active' => ['required', 'boolean']]);
        $user->update(['is_active' => $data['is_active']]);

        return $this->success(new UserResource($user->fresh()), 'Status akun berhasil diperbarui');
    }
}
