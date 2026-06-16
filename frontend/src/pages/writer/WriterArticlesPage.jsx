import { Edit3, Eye, PlusCircle, Send, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { writerApi } from '../../api/articleApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { formatDate } from '../../utils/formatters.js';

const statuses = ['', 'draft', 'pending_review', 'revision', 'published', 'rejected', 'archived'];

export default function WriterArticlesPage() {
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? '';
  const queryClient = useQueryClient();
  const articles = useQuery({ queryKey: ['writer-articles', status], queryFn: () => writerApi.articles({ status }) });
  const submit = useMutation({ mutationFn: writerApi.submit, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['writer-articles'] }) });
  const remove = useMutation({ mutationFn: writerApi.remove, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['writer-articles'] }) });

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Penulis</p>
          <h1 className="text-3xl font-black text-slate-950">Artikel Saya</h1>
        </div>
        <Link to="/writer/articles/create" className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">
          <PlusCircle size={17} /> Artikel Baru
        </Link>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {statuses.map((item) => (
          <button key={item || 'all'} onClick={() => setParams(item ? { status: item } : {})} className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${status === item ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>
            {item || 'semua'}
          </button>
        ))}
      </div>
      {articles.isLoading ? <LoadingState /> : null}
      {articles.isError ? <ErrorState message={articles.error.displayMessage} /> : null}
      {!articles.isLoading && !articles.isError && (articles.data?.data ?? []).length === 0 ? <EmptyState title="Belum ada artikel" /> : null}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {(articles.data?.data ?? []).map((article) => (
          <div key={article.id} className="grid gap-4 border-b border-slate-100 p-4 last:border-b-0 lg:grid-cols-[1fr_130px_220px] lg:items-center">
            <div>
              <p className="font-bold text-slate-950">{article.title}</p>
              <p className="mt-1 text-sm text-slate-500">{formatDate(article.created_at)} / {article.category?.name}</p>
            </div>
            <StatusBadge status={article.status} />
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link to={`/writer/articles/${article.id}/preview`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700" title="Preview"><Eye size={16} /></Link>
              <Link to={`/writer/articles/${article.id}/edit`} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700" title="Edit"><Edit3 size={16} /></Link>
              <button onClick={() => submit.mutate(article.id)} disabled={!['draft', 'revision', 'rejected'].includes(article.status)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 disabled:opacity-30" title="Kirim review"><Send size={16} /></button>
              <button onClick={() => remove.mutate(article.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-200 text-rose-700" title="Hapus"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
