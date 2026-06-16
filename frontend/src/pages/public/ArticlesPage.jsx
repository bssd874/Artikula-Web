import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { articleApi } from '../../api/articleApi.js';
import { categoryApi, tagApi } from '../../api/categoryApi.js';
import ArticleCard from '../../components/article/ArticleCard.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export default function ArticlesPage({ searchOnly = false }) {
  const [params, setParams] = useSearchParams();
  const query = {
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    tag: params.get('tag') ?? '',
    sort: params.get('sort') ?? 'latest',
    page: params.get('page') ?? 1,
  };
  const articles = useQuery({ queryKey: ['articles', query], queryFn: () => articleApi.list(query) });
  const categories = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const tags = useQuery({ queryKey: ['tags'], queryFn: tagApi.list });

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setParams(next);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-700">{searchOnly ? 'Pencarian' : 'Artikel'}</p>
        <h1 className="text-3xl font-black text-slate-950">{searchOnly ? 'Cari Artikel' : 'Daftar Artikel'}</h1>
      </div>
      <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_180px_150px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input value={query.q} onChange={(event) => update('q', event.target.value)} placeholder="Kata kunci" className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-3 outline-none focus:border-teal-600" />
        </label>
        <select value={query.category} onChange={(event) => update('category', event.target.value)} className="rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600">
          <option value="">Semua kategori</option>
          {(categories.data?.data ?? []).map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
        </select>
        <select value={query.tag} onChange={(event) => update('tag', event.target.value)} className="rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600">
          <option value="">Semua tag</option>
          {(tags.data?.data ?? []).map((tag) => <option key={tag.id} value={tag.slug}>{tag.name}</option>)}
        </select>
        <select value={query.sort} onChange={(event) => update('sort', event.target.value)} className="rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600">
          <option value="latest">Terbaru</option>
          <option value="popular">Terpopuler</option>
        </select>
      </div>
      {articles.isLoading ? <LoadingState /> : null}
      {articles.isError ? <ErrorState message={articles.error.displayMessage} /> : null}
      {!articles.isLoading && !articles.isError && (articles.data?.data ?? []).length === 0 ? <EmptyState title="Artikel tidak ditemukan" description="Coba kata kunci atau filter lain." /> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {(articles.data?.data ?? []).map((article) => <ArticleCard key={article.id} article={article} />)}
      </div>
      <Pagination meta={articles.data?.meta} onPage={(page) => update('page', String(page))} />
    </section>
  );
}
