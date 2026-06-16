import { AlertCircle, Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Memuat data' }) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
      <Loader2 className="mr-2 animate-spin" size={18} />
      {label}
    </div>
  );
}

export function ErrorState({ message = 'Data belum dapat dimuat.' }) {
  return (
    <div className="flex min-h-36 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-4 text-rose-700">
      <AlertCircle className="mr-2" size={18} />
      {message}
    </div>
  );
}

export function EmptyState({ title = 'Belum ada data', description = 'Data akan tampil di sini setelah tersedia.' }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
