import { useQuery } from '@tanstack/react-query';
import { articleApi } from '../../api/articleApi.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { formatDate } from '../../utils/formatters.js';

export default function MyCommentsPage() {
  const comments = useQuery({ queryKey: ['my-comments'], queryFn: () => articleApi.myComments() });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Pembaca</p>
        <h1 className="text-3xl font-black text-slate-950">Komentar Saya</h1>
      </div>
      {comments.isLoading ? <LoadingState /> : null}
      {comments.isError ? <ErrorState message={comments.error.displayMessage} /> : null}
      {!comments.isLoading && !comments.isError && (comments.data?.data ?? []).length === 0 ? <EmptyState title="Belum ada komentar" /> : null}
      <div className="space-y-3">
        {(comments.data?.data ?? []).map((comment) => (
          <div key={comment.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold text-slate-950">Artikel #{comment.article_id}</p>
              <p className="text-sm text-slate-500">{formatDate(comment.created_at)}</p>
            </div>
            <p className="mt-2 text-slate-600">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
