import { Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { categoryApi, tagApi } from '../../api/categoryApi.js';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export function AdminCategoriesPage() {
  return <TaxonomyManager title="Kategori" queryKey="categories" api={categoryApi} withDescription />;
}

export function AdminTagsPage() {
  return <TaxonomyManager title="Tag" queryKey="tags" api={tagApi} />;
}

function TaxonomyManager({ title, queryKey, api, withDescription = false }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', description: '' });
  const list = useQuery({ queryKey: [queryKey], queryFn: api.list });
  const create = useMutation({
    mutationFn: (payload) => api.create(payload),
    onSuccess: () => {
      setForm({ name: '', description: '' });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
  const remove = useMutation({ mutationFn: api.remove, onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }) });

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">Administrator</p>
        <h1 className="text-3xl font-black text-slate-950">{title}</h1>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate(withDescription ? form : { name: form.name });
        }}
        className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[220px_1fr_auto]"
      >
        <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={`Nama ${title.toLowerCase()}`} className="rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required />
        <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Deskripsi" className="rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" disabled={!withDescription} />
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white"><Plus size={16} /> Tambah</button>
      </form>
      {list.isLoading ? <LoadingState /> : null}
      {list.isError || create.isError || remove.isError ? <ErrorState message={(list.error || create.error || remove.error)?.displayMessage} /> : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(list.data?.data ?? []).map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-950">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">{item.articles_count ?? 0} artikel</p>
              </div>
              <button onClick={() => remove.mutate(item.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-200 text-rose-700" title="Hapus">
                <Trash2 size={16} />
              </button>
            </div>
            {item.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
