import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/articleApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx';
import { formatDate } from '../../utils/formatters.js';

const statuses = ['pending', 'reviewed', 'resolved'];

export default function AdminReportsPage() {
  const queryClient = useQueryClient();
  const reports = useQuery({ queryKey: ['admin-reports'], queryFn: () => adminApi.reports() });
  const update = useMutation({ mutationFn: ({ id, status }) => adminApi.updateReport(id, { status }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reports'] }) });
  const items = reports.data?.data?.data ?? reports.data?.data ?? [];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Administrator</p>
        <h1 className="text-3xl font-black text-slate-950">Laporan</h1>
      </div>
      {reports.isLoading ? <LoadingState /> : null}
      {reports.isError ? <ErrorState message={reports.error.displayMessage} /> : null}
      {!reports.isLoading && !reports.isError && items.length === 0 ? <EmptyState title="Belum ada laporan" /> : null}
      <div className="space-y-3">
        {items.map((report) => (
          <div key={report.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-950">{report.reason}</p>
                <p className="text-sm text-slate-500">Pelapor #{report.user_id} / {formatDate(report.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={report.status} />
                <select value={report.status} onChange={(event) => update.mutate({ id: report.id, status: event.target.value })} className="rounded-md border border-slate-200 px-2 py-2 text-sm">
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
            {report.description ? <p className="mt-3 text-slate-600">{report.description}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
