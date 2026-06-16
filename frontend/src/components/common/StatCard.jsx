export default function StatCard({ icon: Icon, label, value, tone = 'text-teal-700 bg-teal-50' }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>
        {Icon ? (
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${tone}`}>
            <Icon size={18} />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-950">{value ?? 0}</p>
    </div>
  );
}
