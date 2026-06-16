<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public const ROLE_READER = 'reader';

    public const ROLE_WRITER = 'writer';

    public const ROLE_EDITOR = 'editor';

    public const ROLE_ADMIN = 'admin';

    public const ROLES = [
        self::ROLE_READER,
        self::ROLE_WRITER,
        self::ROLE_EDITOR,
        self::ROLE_ADMIN,
    ];

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'avatar',
        'bio',
        'phone',
        'website',
        'is_active',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ArticleReview::class, 'reviewer_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isEditor(): bool
    {
        return in_array($this->role, [self::ROLE_EDITOR, self::ROLE_ADMIN], true);
    }

    public function canWriteArticles(): bool
    {
        return in_array($this->role, [self::ROLE_WRITER, self::ROLE_EDITOR, self::ROLE_ADMIN], true);
    }
}
