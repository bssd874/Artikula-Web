import { CheckCircle2, FileClock, FilePenLine, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { editorApi } from '../../api/articleApi.js';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { formatDate } from '../../utils/formatters.js';

export default function EditorDashboard() {
  const dashboard = useQuery({ queryKey: ['editor-dashboard'], queryFn: editorApi.dashboard });
  const data = dashboard.data?.data;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Editor</p>
        <h1 className="text-3xl font-black text-slate-950">Dashboard Review</h1>
      </div>
      {dashboard.isLoading ? <LoadingState /> : null}
      {dashboard.isError ? <ErrorState message={dashboard.error.displayMessage} /> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={FileClock} label="Menunggu review" value={data.pending_review} tone="bg-amber-50 text-amber-700" />
            <StatCard icon={FilePenLine} label="Butuh revisi" value={data.revision} tone="bg-sky-50 text-sky-700" />
            <StatCard icon={CheckCircle2} label="Disetujui" value={data.approved} tone="bg-emerald-50 text-emerald-700" />
            <StatCard icon={XCircle} label="Ditolak" value={data.rejected} tone="bg-rose-50 text-rose-700" />
          </div>
          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="font-bold text-slate-950">Antrian review</h2>
            </div>
            {(data.latest_reviews ?? []).map((article) => (
              <Link key={article.id} to={`/editor/reviews/${article.id}`} className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 hover:bg-slate-50 md:grid-cols-[1fr_130px_140px] md:items-center">
                <div>
                  <p className="font-semibold text-slate-950">{article.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{article.author?.name} / {formatDate(article.created_at)}</p>
                </div>
                <StatusBadge status={article.status} />
                <p className="text-sm text-slate-500">{article.category?.name}</p>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
