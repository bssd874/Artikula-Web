import { Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/articleApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { formatDate } from '../../utils/formatters.js';

const statuses = ['draft', 'pending_review', 'revision', 'published', 'rejected', 'archived'];

export default function AdminArticlesPage() {
  const queryClient = useQueryClient();
  const articles = useQuery({ queryKey: ['admin-articles'], queryFn: () => adminApi.articles() });
  const statusMutation = useMutation({ mutationFn: ({ id, status }) => adminApi.updateArticleStatus(id, { status }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-articles'] }) });
  const remove = useMutation({ mutationFn: adminApi.deleteArticle, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-articles'] }) });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Administrator</p>
        <h1 className="text-3xl font-black text-slate-950">Artikel</h1>
      </div>
      {articles.isLoading ? <LoadingState /> : null}
      {articles.isError ? <ErrorState message={articles.error.displayMessage} /> : null}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {(articles.data?.data ?? []).map((article) => (
          <div key={article.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 lg:grid-cols-[1fr_130px_160px_80px] lg:items-center">
            <div>
              <Link to={`/articles/${article.slug}`} className="font-bold text-slate-950 hover:text-teal-700">{article.title}</Link>
              <p className="mt-1 text-sm text-slate-500">{article.author?.name} / {formatDate(article.created_at)}</p>
            </div>
            <StatusBadge status={article.status} />
            <select value={article.status} onChange={(event) => statusMutation.mutate({ id: article.id, status: event.target.value })} className="rounded-md border border-slate-200 px-2 py-2 text-sm">
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <button onClick={() => remove.mutate(article.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-200 text-rose-700" title="Hapus">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
