import { BookOpenText, Eye, FolderTree, MessageSquare, UsersRound } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/articleApi.js';
import StatCard from '../../components/common/StatCard.jsx';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { compactNumber } from '../../utils/formatters.js';

export default function AdminDashboard() {
  const dashboard = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminApi.dashboard });
  const data = dashboard.data?.data;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Administrator</p>
        <h1 className="text-3xl font-black text-slate-950">Dashboard</h1>
      </div>
      {dashboard.isLoading ? <LoadingState /> : null}
      {dashboard.isError ? <ErrorState message={dashboard.error.displayMessage} /> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard icon={UsersRound} label="Pengguna" value={data.total_users} />
            <StatCard icon={BookOpenText} label="Artikel" value={data.total_articles} tone="bg-sky-50 text-sky-700" />
            <StatCard icon={FolderTree} label="Kategori" value={data.total_categories} tone="bg-amber-50 text-amber-700" />
            <StatCard icon={MessageSquare} label="Komentar" value={data.total_comments} tone="bg-rose-50 text-rose-700" />
            <StatCard icon={Eye} label="Pembaca" value={compactNumber(data.total_article_views)} tone="bg-emerald-50 text-emerald-700" />
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-4 font-bold text-slate-950">Artikel terpopuler</h2>
              <div className="space-y-3">
                {(data.popular_articles ?? []).map((article) => (
                  <Link key={article.id} to={`/articles/${article.slug}`} className="block rounded-md border border-slate-100 p-3 hover:bg-slate-50">
                    <p className="font-semibold text-slate-950">{article.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{compactNumber(article.view_count)} pembaca</p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-4 font-bold text-slate-950">Penulis aktif</h2>
              <div className="space-y-3">
                {(data.active_authors ?? []).map((author) => (
                  <div key={author.id} className="rounded-md border border-slate-100 p-3">
                    <p className="font-semibold text-slate-950">{author.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{author.articles_count} artikel / {author.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
