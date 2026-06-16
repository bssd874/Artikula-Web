import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { writerApi } from '../../api/articleApi.js';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export default function WriterStatisticsPage() {
  const dashboard = useQuery({ queryKey: ['writer-dashboard'], queryFn: writerApi.dashboard });
  const data = dashboard.data?.data;
  const chart = data
    ? [
        { name: 'Draft', total: data.draft_articles },
        { name: 'Review', total: data.pending_review_articles },
        { name: 'Published', total: data.published_articles },
      ]
    : [];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Penulis</p>
        <h1 className="text-3xl font-black text-slate-950">Statistik</h1>
      </div>
      {dashboard.isLoading ? <LoadingState /> : null}
      {dashboard.isError ? <ErrorState message={dashboard.error.displayMessage} /> : null}
      {data ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </section>
  );
}
