<?php

use App\Http\Controllers\Api\V1\AdminArticleController;
use App\Http\Controllers\Api\V1\AdminUserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\InteractionController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\PublicArticleController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\WriterArticleController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->name('auth.forgot-password');
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->name('auth.reset-password');

    Route::get('/articles', [PublicArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{slug}', [PublicArticleController::class, 'show'])->name('articles.show');
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/{slug}', [CategoryController::class, 'show'])->name('categories.show');
    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
    Route::get('/tags/{slug}', [TagController::class, 'show'])->name('tags.show');
    Route::get('/authors/{username}', [ProfileController::class, 'author'])->name('authors.show');
    Route::get('/articles/{article}/comments', [CommentController::class, 'index'])->name('comments.index');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('/auth/me', [AuthController::class, 'me'])->name('auth.me');

        Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::get('/my-comments', [CommentController::class, 'mine'])->name('comments.mine');

        Route::post('/articles/{article}/comments', [CommentController::class, 'store'])->name('comments.store');
        Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
        Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
        Route::post('/articles/{article}/like', [InteractionController::class, 'toggleLike'])->name('articles.like');
        Route::post('/articles/{article}/bookmark', [InteractionController::class, 'toggleBookmark'])->name('articles.bookmark');
        Route::get('/bookmarks', [InteractionController::class, 'bookmarks'])->name('bookmarks.index');
        Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');

        Route::middleware('role:'.User::ROLE_WRITER.','.User::ROLE_EDITOR.','.User::ROLE_ADMIN)->group(function (): void {
            Route::get('/writer/dashboard', [DashboardController::class, 'writer'])->name('writer.dashboard');
            Route::get('/my/articles', [WriterArticleController::class, 'index'])->name('my-articles.index');
            Route::post('/articles', [WriterArticleController::class, 'store'])->name('my-articles.store');
            Route::get('/my/articles/{article}', [WriterArticleController::class, 'show'])->name('my-articles.show');
            Route::put('/my/articles/{article}', [WriterArticleController::class, 'update'])->name('my-articles.update');
            Route::delete('/my/articles/{article}', [WriterArticleController::class, 'destroy'])->name('my-articles.destroy');
            Route::post('/my/articles/{article}/submit', [WriterArticleController::class, 'submit'])->name('my-articles.submit');
            Route::post('/my/articles/{article}/archive', [WriterArticleController::class, 'archive'])->name('my-articles.archive');
        });

        Route::middleware('role:'.User::ROLE_EDITOR.','.User::ROLE_ADMIN)->group(function (): void {
            Route::get('/editor/dashboard', [DashboardController::class, 'editor'])->name('editor.dashboard');
            Route::get('/editor/reviews', [ReviewController::class, 'index'])->name('reviews.index');
            Route::get('/editor/reviews/{article}', [ReviewController::class, 'show'])->name('reviews.show');
            Route::post('/editor/reviews/{article}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
            Route::post('/editor/reviews/{article}/revision', [ReviewController::class, 'revision'])->name('reviews.revision');
            Route::post('/editor/reviews/{article}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
        });

        Route::middleware('role:'.User::ROLE_ADMIN)->group(function (): void {
            Route::get('/admin/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
            Route::get('/admin/users', [AdminUserController::class, 'index'])->name('admin.users.index');
            Route::get('/admin/users/{user}', [AdminUserController::class, 'show'])->name('admin.users.show');
            Route::patch('/admin/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('admin.users.role');
            Route::patch('/admin/users/{user}/status', [AdminUserController::class, 'updateStatus'])->name('admin.users.status');

            Route::get('/admin/articles', [AdminArticleController::class, 'index'])->name('admin.articles.index');
            Route::patch('/admin/articles/{article}/status', [AdminArticleController::class, 'updateStatus'])->name('admin.articles.status');
            Route::delete('/admin/articles/{article}', [AdminArticleController::class, 'destroy'])->name('admin.articles.destroy');

            Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
            Route::put('/admin/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
            Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');

            Route::post('/admin/tags', [TagController::class, 'store'])->name('admin.tags.store');
            Route::put('/admin/tags/{tag}', [TagController::class, 'update'])->name('admin.tags.update');
            Route::delete('/admin/tags/{tag}', [TagController::class, 'destroy'])->name('admin.tags.destroy');

            Route::get('/admin/comments', [CommentController::class, 'adminIndex'])->name('admin.comments.index');
            Route::patch('/admin/comments/{comment}/hide', [CommentController::class, 'hide'])->name('admin.comments.hide');
            Route::get('/admin/reports', [ReportController::class, 'index'])->name('admin.reports.index');
            Route::patch('/admin/reports/{report}', [ReportController::class, 'update'])->name('admin.reports.update');
        });
    });
});
