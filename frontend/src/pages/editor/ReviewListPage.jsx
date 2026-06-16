import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { editorApi } from '../../api/articleApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { formatDate } from '../../utils/formatters.js';

export default function ReviewListPage() {
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? '';
  const reviews = useQuery({ queryKey: ['reviews', status], queryFn: () => editorApi.reviews({ status }) });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Editor</p>
        <h1 className="text-3xl font-black text-slate-950">Review Artikel</h1>
      </div>
      <div className="mb-4 flex gap-2">
        {['', 'pending_review', 'revision'].map((item) => (
          <button key={item || 'all'} onClick={() => setParams(item ? { status: item } : {})} className={`rounded-md px-3 py-2 text-sm font-semibold ${status === item ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>
            {item || 'semua'}
          </button>
        ))}
      </div>
      {reviews.isLoading ? <LoadingState /> : null}
      {reviews.isError ? <ErrorState message={reviews.error.displayMessage} /> : null}
      {!reviews.isLoading && !reviews.isError && (reviews.data?.data ?? []).length === 0 ? <EmptyState title="Tidak ada antrian review" /> : null}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {(reviews.data?.data ?? []).map((article) => (
          <Link key={article.id} to={`/editor/reviews/${article.id}`} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 hover:bg-slate-50 md:grid-cols-[1fr_140px_140px] md:items-center">
            <div>
              <p className="font-bold text-slate-950">{article.title}</p>
              <p className="mt-1 text-sm text-slate-500">{article.author?.name} / {formatDate(article.created_at)}</p>
            </div>
            <StatusBadge status={article.status} />
            <p className="text-sm text-slate-500">{article.category?.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
