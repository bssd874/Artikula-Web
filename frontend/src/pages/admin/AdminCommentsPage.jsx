import { EyeOff } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/articleApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { formatDate } from '../../utils/formatters.js';

export default function AdminCommentsPage() {
  const queryClient = useQueryClient();
  const comments = useQuery({ queryKey: ['admin-comments'], queryFn: () => adminApi.comments() });
  const hide = useMutation({ mutationFn: adminApi.hideComment, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-comments'] }) });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Administrator</p>
        <h1 className="text-3xl font-black text-slate-950">Komentar</h1>
      </div>
      {comments.isLoading ? <LoadingState /> : null}
      {comments.isError ? <ErrorState message={comments.error.displayMessage} /> : null}
      {!comments.isLoading && !comments.isError && (comments.data?.data ?? []).length === 0 ? <EmptyState title="Belum ada komentar" /> : null}
      <div className="space-y-3">
        {(comments.data?.data ?? []).map((comment) => (
          <div key={comment.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{comment.user?.name}</p>
                <p className="text-sm text-slate-500">{comment.article?.title ?? `Artikel #${comment.article_id}`} / {formatDate(comment.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={comment.status} />
                <button onClick={() => hide.mutate(comment.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700" title="Sembunyikan"><EyeOff size={16} /></button>
              </div>
            </div>
            <p className="mt-3 text-slate-600">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
