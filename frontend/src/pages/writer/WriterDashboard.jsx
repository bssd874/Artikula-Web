import { BookOpenText, Eye, Heart, MessageCircle, PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { writerApi } from '../../api/articleApi.js';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { compactNumber, formatDate } from '../../utils/formatters.js';

export default function WriterDashboard() {
  const dashboard = useQuery({ queryKey: ['writer-dashboard'], queryFn: writerApi.dashboard });
  const data = dashboard.data?.data;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">Penulis</p>
          <h1 className="text-3xl font-black text-slate-950">Dashboard</h1>
        </div>
        <Link to="/writer/articles/create" className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">
          <PlusCircle size={17} /> Artikel Baru
        </Link>
      </div>
      {dashboard.isLoading ? <LoadingState /> : null}
      {dashboard.isError ? <ErrorState message={dashboard.error.displayMessage} /> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={BookOpenText} label="Total artikel" value={data.total_articles} />
            <StatCard icon={Eye} label="Total pembaca" value={compactNumber(data.total_views)} tone="bg-sky-50 text-sky-700" />
            <StatCard icon={Heart} label="Total like" value={compactNumber(data.total_likes)} tone="bg-rose-50 text-rose-700" />
            <StatCard icon={MessageCircle} label="Total komentar" value={compactNumber(data.total_comments)} tone="bg-amber-50 text-amber-700" />
          </div>
          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="font-bold text-slate-950">Artikel terbaru</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {data.latest_articles.map((article) => (
                <Link key={article.id} to={`/writer/articles/${article.id}/edit`} className="grid gap-3 px-4 py-4 hover:bg-slate-50 md:grid-cols-[1fr_120px_120px] md:items-center">
                  <div>
                    <p className="font-semibold text-slate-950">{article.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{formatDate(article.created_at)}</p>
                  </div>
                  <StatusBadge status={article.status} />
                  <p className="text-sm text-slate-500">{compactNumber(article.likes_count)} like</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
