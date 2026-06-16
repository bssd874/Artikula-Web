import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ meta, onPage }) {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-sm text-slate-500">
        Halaman {meta.current_page} dari {meta.last_page}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPage(meta.current_page - 1)}
          disabled={meta.current_page <= 1}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          onClick={() => onPage(meta.current_page + 1)}
          disabled={meta.current_page >= meta.last_page}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
