import { ArrowRight, BookMarked, Eye, Heart, Search, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { articleApi } from '../../api/articleApi.js';
import { categoryApi } from '../../api/categoryApi.js';
import ArticleCard from '../../components/article/ArticleCard.jsx';
import { ErrorState, LoadingState } from '../../components/common/StateViews.jsx';

export default function HomePage() {
  const articles = useQuery({ queryKey: ['articles', 'home'], queryFn: () => articleApi.list({ per_page: 6 }) });
  const popular = useQuery({ queryKey: ['articles', 'popular'], queryFn: () => articleApi.list({ per_page: 3, sort: 'popular' }) });
  const categories = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const featured = articles.data?.data?.[0];
  const latest = (articles.data?.data ?? []).filter((article) => article.id !== featured?.id);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.92),rgba(15,23,42,0.72)_44%,rgba(15,23,42,0.2))]" />
        <div className="relative mx-auto grid min-h-[430px] max-w-7xl items-end gap-8 px-4 py-10 text-white sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="max-w-3xl pb-4">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-semibold ring-1 ring-white/20">
              <Sparkles size={16} /> Publikasi terkurasi
            </p>
            <h1 className="text-5xl font-black leading-none sm:text-6xl lg:text-7xl">Artikula</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">Baca artikel terbaru, simpan bacaan penting, dan kelola workflow editorial dari draft sampai publish.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/articles" className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300">
                <BookMarked size={17} /> Baca Artikel
              </Link>
              <Link to="/search" className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/30 hover:bg-white/15">
                <Search size={17} /> Cari Topik
              </Link>
            </div>
          </div>
          <div className="hidden rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur md:block">
            <p className="text-sm font-semibold text-amber-200">Ringkasan konten</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-white/10 p-4">
                <p className="text-3xl font-black">{articles.data?.meta?.total ?? 0}</p>
                <p className="mt-1 text-sm text-slate-200">Artikel aktif</p>
              </div>
              <div className="rounded-md bg-white/10 p-4">
                <p className="text-3xl font-black">{categories.data?.data?.length ?? 0}</p>
                <p className="mt-1 text-sm text-slate-200">Kategori</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {(categories.data?.data ?? []).slice(0, 3).map((category) => (
                <Link key={category.id} to={`/categories/${category.slug}`} className="flex items-center justify-between rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15">
                  <span>{category.name}</span>
                  <span className="text-slate-200">{category.articles_count ?? 0}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {featured ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_360px]">
            <Link to={`/articles/${featured.slug}`} className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md md:grid-cols-[0.95fr_1.05fr]">
              <img src={featured.thumbnail} alt="" className="h-72 w-full object-cover md:h-full" />
              <div className="flex min-h-[320px] flex-col justify-between p-6 lg:p-7">
                <div>
                  <p className="text-sm font-semibold text-teal-700">Artikel unggulan</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950">{featured.title}</h2>
                  <p className="mt-4 leading-7 text-slate-600">{featured.excerpt}</p>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-950">
                    Buka detail <ArrowRight size={16} />
                  </span>
                  <span className="inline-flex items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1"><Eye size={15} />{featured.view_count}</span>
                    <span className="inline-flex items-center gap-1"><Heart size={15} />{featured.likes_count}</span>
                  </span>
                </div>
              </div>
            </Link>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-sm font-semibold text-teal-700">Topik cepat</p>
              <div className="space-y-3">
                {(categories.data?.data ?? []).slice(0, 5).map((category) => (
                  <Link key={category.id} to={`/categories/${category.slug}`} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-3 hover:border-teal-200 hover:bg-teal-50">
                    <span className="font-semibold text-slate-800">{category.name}</span>
                    <span className="text-sm text-slate-500">{category.articles_count ?? 0} artikel</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-700">Terbaru</p>
            <h2 className="text-3xl font-black text-slate-950">Artikel Pilihan</h2>
          </div>
          <Link to="/articles" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
            Semua artikel <ArrowRight size={16} />
          </Link>
        </div>
        {articles.isLoading ? <LoadingState /> : null}
        {articles.isError ? <ErrorState message={articles.error.displayMessage} /> : null}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {latest.map((article) => <ArticleCard key={article.id} article={article} />)}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-teal-700">Navigasi topik</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Kategori dan artikel populer</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(categories.data?.data ?? []).slice(0, 6).map((category) => (
              <Link key={category.id} to={`/categories/${category.slug}`} className="rounded-lg border border-slate-200 p-4 hover:border-teal-300 hover:bg-teal-50">
                <p className="font-bold text-slate-950">{category.name}</p>
                <p className="mt-1 text-sm text-slate-500">{category.articles_count ?? 0} artikel</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {(popular.data?.data ?? []).map((article) => <ArticleCard key={article.id} article={article} />)}
        </div>
      </section>
    </>
  );
}
