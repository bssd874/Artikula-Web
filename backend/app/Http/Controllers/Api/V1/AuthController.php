<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    use RespondsWithApi;

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'alpha_dash:ascii', 'max:50', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $user = User::create([
            ...$data,
            'role' => User::ROLE_READER,
            'is_active' => true,
        ]);

        return $this->success([
            'user' => new UserResource($user),
            'token' => $user->createToken('artikula-api')->plainTextToken,
        ], 'Registrasi berhasil', Response::HTTP_CREATED);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['login'])
            ->orWhere('username', $data['login'])
            ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return $this->error('Email, username, atau password tidak sesuai.', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! $user->is_active) {
            return $this->error('Akun Anda sedang dinonaktifkan.', Response::HTTP_FORBIDDEN);
        }

        return $this->success([
            'user' => new UserResource($user),
            'token' => $user->createToken('artikula-api')->plainTextToken,
        ], 'Login berhasil');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->success(null, 'Logout berhasil');
    }

    public function me(Request $request)
    {
        return $this->success(new UserResource($request->user()), 'Data pengguna aktif berhasil diambil');
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        Password::sendResetLink($request->only('email'));

        return $this->success(null, 'Instruksi reset password telah dikirim jika email terdaftar.');
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset($data, function (User $user, string $password): void {
            $user->forceFill(['password' => $password])->save();
            $user->tokens()->delete();
        });

        if ($status !== Password::PASSWORD_RESET) {
            return $this->error('Token reset password tidak valid.', Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $this->success(null, 'Password berhasil direset');
    }
}
