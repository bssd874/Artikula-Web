<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\RespondsWithApi;
use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class ReportController extends Controller
{
    use RespondsWithApi;

    public function store(Request $request)
    {
        $data = $request->validate([
            'article_id' => ['nullable', 'integer', 'exists:articles,id', 'required_without:comment_id'],
            'comment_id' => ['nullable', 'integer', 'exists:comments,id', 'required_without:article_id'],
            'reason' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $report = Report::create([
            ...$data,
            'user_id' => $request->user()->id,
            'status' => Report::STATUS_PENDING,
        ]);

        return $this->success($report, 'Laporan berhasil dibuat', Response::HTTP_CREATED);
    }

    public function index(Request $request)
    {
        $query = Report::with(['user', 'article', 'comment'])->latest();
        $query->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')));

        return $this->success($query->paginate(min($request->integer('per_page', 15), 100)), 'Daftar laporan berhasil diambil');
    }

    public function update(Request $request, Report $report)
    {
        $data = $request->validate(['status' => ['required', Rule::in(Report::STATUSES)]]);
        $report->update($data);

        return $this->success($report->fresh()->load(['user', 'article', 'comment']), 'Status laporan berhasil diperbarui');
    }
}
