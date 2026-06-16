import { statusLabel } from '../../utils/formatters.js';

const tones = {
  draft: 'bg-slate-100 text-slate-700 ring-slate-200',
  pending_review: 'bg-amber-100 text-amber-800 ring-amber-200',
  revision: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
  published: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 ring-rose-200',
  archived: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
  hidden: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
  reported: 'bg-rose-100 text-rose-800 ring-rose-200',
  pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  reviewed: 'bg-sky-100 text-sky-800 ring-sky-200',
  resolved: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[status] ?? 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
      {statusLabel(status)}
    </span>
  );
}
