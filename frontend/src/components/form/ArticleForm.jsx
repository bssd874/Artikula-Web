import { Save, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryApi, tagApi } from '../../api/categoryApi.js';
import RichTextEditor from './RichTextEditor.jsx';

const emptyArticle = {
  title: '',
  excerpt: '',
  content: '<p></p>',
  thumbnail: '',
  category_id: '',
  tag_ids: [],
  allow_comments: true,
};

export default function ArticleForm({ initialValue, onSubmit, onSubmitForReview, saving = false }) {
  const [form, setForm] = useState(emptyArticle);
  const categories = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const tags = useQuery({ queryKey: ['tags'], queryFn: tagApi.list });

  useEffect(() => {
    if (initialValue) {
      setForm({
        ...emptyArticle,
        ...initialValue,
        category_id: initialValue.category?.id ?? initialValue.category_id ?? '',
        tag_ids: initialValue.tags?.map((tag) => tag.id) ?? initialValue.tag_ids ?? [],
      });
    }
  }, [initialValue]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const toggleTag = (id) => setForm((current) => ({
    ...current,
    tag_ids: current.tag_ids.includes(id) ? current.tag_ids.filter((tagId) => tagId !== id) : [...current.tag_ids, id],
  }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      category_id: Number(form.category_id),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Judul</span>
            <input value={form.title} onChange={(event) => update('title', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required maxLength={255} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Ringkasan</span>
            <textarea value={form.excerpt} onChange={(event) => update('excerpt', event.target.value)} className="mt-1 min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required />
          </label>
          <div>
            <span className="text-sm font-semibold text-slate-700">Isi artikel</span>
            <div className="mt-1">
              <RichTextEditor value={form.content} onChange={(value) => update('content', value)} />
            </div>
          </div>
        </section>
        <aside className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Gambar sampul</span>
            <input value={form.thumbnail ?? ''} onChange={(event) => update('thumbnail', event.target.value)} placeholder="https://..." className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Kategori</span>
            <select value={form.category_id} onChange={(event) => update('category_id', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" required>
              <option value="">Pilih kategori</option>
              {(categories.data?.data ?? []).map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <div>
            <span className="text-sm font-semibold text-slate-700">Tag</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(tags.data?.data ?? []).map((tag) => (
                <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)} className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${form.tag_ids.includes(tag.id) ? 'bg-amber-100 text-amber-800 ring-amber-200' : 'bg-white text-slate-600 ring-slate-200'}`}>
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <span className="text-sm font-semibold text-slate-700">Komentar aktif</span>
            <input type="checkbox" checked={form.allow_comments} onChange={(event) => update('allow_comments', event.target.checked)} className="h-4 w-4 accent-teal-700" />
          </label>
        </aside>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
          <Save size={16} /> Simpan Draft
        </button>
        {onSubmitForReview ? (
          <button type="button" disabled={saving} onClick={() => onSubmitForReview()} className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
            <Send size={16} /> Kirim Review
          </button>
        ) : null}
      </div>
    </form>
  );
}
